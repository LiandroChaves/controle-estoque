const express = require('express');
const pool = require('../database/db');
const { autenticarUsuario } = require('./login');
const Venda = require('../database/models/venda'); // Importa o modelo Venda
const Produto = require('../database/models/produtos'); // Importa o modelo Produto
const router = express.Router();

// Rota para buscar vendas de um usuário
router.get('/api/vendas/:usuario_id', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;
    try {
        // Verifica se o ID do usuário autenticado corresponde ao solicitado
        if (parseInt(usuarioId, 10) !== req.usuario.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Consulta ao banco para obter vendas com informações do produto (incluindo imagem)
        const vendas = await pool.query(`
            SELECT 
                vendas.id, 
                vendas.quantidade, 
                vendas.preco, 
                produtos.nome AS produto, 
                produtos.categoria,
                produtos.subcategoria, 
                produtos.imagem
            FROM vendas
            INNER JOIN produtos ON vendas.cod_produto = produtos.id
            WHERE vendas.usuario_id = $1
        `, [usuarioId]);

        res.json(vendas.rows); // Retorna as vendas no formato esperado
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});


// Rota para excluir uma venda pelo ID
// Rota para excluir uma venda pelo ID
router.delete('/api/vendas/:id', autenticarUsuario, async (req, res) => {
    const { id } = req.params;

    try {
        // Busca a venda pelo ID usando Sequelize
        const venda = await Venda.findByPk(id);

        if (!venda) {
            return res.status(404).json({ error: 'Venda não encontrada' });
        }

        // Verifica se o usuário autenticado é o dono da venda
        if (venda.usuario_id !== req.usuario.id) {
            return res.status(403).json({ error: 'Acesso negado para excluir esta venda' });
        }

        // Exclui a venda
        await venda.destroy();

        res.status(200).json({ message: 'Venda excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        res.status(500).json({ error: 'Erro ao excluir venda' });
    }
});


// Rota para esvaziar o carrinho do usuário
router.delete('/api/vendas/usuario/:usuario_id', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;

    try {
        // Verifica se o ID do usuário autenticado corresponde ao solicitado
        if (parseInt(usuarioId, 10) !== req.usuario.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Busca todas as vendas do usuário
        const vendas = await Venda.findAll({ where: { usuario_id: usuarioId } });

        // Restaura o estoque de cada produto antes de excluir as vendas
        for (const venda of vendas) {
            const produto = await Produto.findByPk(venda.cod_produto);
            if (produto) {
                await produto.update({
                    estoque: produto.estoque + venda.quantidade, // Restaura o estoque
                });
            }
        }

        // Exclui todas as vendas do usuário
        await Venda.destroy({
            where: { usuario_id: usuarioId },
        });

        res.status(200).json({ message: 'Carrinho esvaziado com sucesso!' });
    } catch (error) {
        console.error('Erro ao esvaziar o carrinho:', error);
        res.status(500).json({ error: 'Erro ao esvaziar o carrinho' });
    }
});

// Rota para esvaziar o carrinho sem restaurar o estoque
router.delete('/api/vendas/usuario/:usuario_id/limpar', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;
    
    console.log(`🛒 Tentando esvaziar carrinho do usuário: ${usuarioId}`);

    try {
        if (parseInt(usuarioId, 10) !== req.usuario.id) {
            console.error('🚫 Acesso negado: ID do usuário não corresponde ao autenticado.');
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Agora, exclui as vendas
        const resultado = await pool.query(
            `DELETE FROM vendas WHERE usuario_id = $1`, 
            [usuarioId]
        );

        console.log(`✅ Vendas excluídas: ${resultado.rowCount}`);

        res.status(200).json({ message: 'Carrinho esvaziado sem restaurar o estoque!' });
    } catch (error) {
        console.error('❌ Erro ao esvaziar o carrinho sem restaurar estoque:', error);
        res.status(500).json({ error: 'Erro ao esvaziar o carrinho' });
    }
});


router.delete('/api/vendas/:venda_id/limparUnico', autenticarUsuario, async (req, res) => {
    const { venda_id } = req.params;

    console.log(`🛒 Tentando remover venda ID: ${venda_id}`);

    try {
        // Verifica se a venda pertence ao usuário autenticado
        const venda = await pool.query(
            "SELECT usuario_id FROM vendas WHERE id = $1",
            [venda_id]
        );

        if (venda.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada." });
        }

        if (venda.rows[0].usuario_id !== req.usuario.id) {
            console.error('🚫 Acesso negado: Venda não pertence ao usuário autenticado.');
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Exclui apenas a venda específica
        await pool.query("DELETE FROM vendas WHERE id = $1", [venda_id]);

        console.log(`✅ Venda ID ${venda_id} removida com sucesso!`);

        res.status(200).json({ message: "Item removido do carrinho!" });
    } catch (error) {
        console.error('❌ Erro ao remover item do carrinho:', error);
        res.status(500).json({ error: 'Erro ao remover item do carrinho' });
    }
});


router.get('/api/vendas/categoria/:categoria', autenticarUsuario, async (req, res) => {
    const { categoria } = req.params;
    const usuarioId = req.usuario?.id;
    const categoriaDecodificada = decodeURIComponent(categoria); // Decodifica categoria

    try {
        if (!categoriaDecodificada || !usuarioId) {
            return res.status(400).json({ error: "Categoria ou usuário não informado" });
        }

        const vendas = await pool.query(
            `SELECT vendas.id, vendas.quantidade, vendas.preco, produtos.nome AS produto, produtos.categoria, produtos.subcategoria, produtos.imagem
             FROM vendas
             JOIN produtos ON vendas.cod_produto = produtos.id
             WHERE produtos.categoria = $1 AND vendas.usuario_id = $2`,
            [categoriaDecodificada, usuarioId]
        );

        res.json(vendas.rows);
    } catch (err) {
        console.error("❌ Erro ao buscar vendas por categoria:", err);
        res.status(500).json({ error: "Erro ao buscar vendas por categoria" });
    }
});

router.get('/api/vendas/subcategoria/:subcategoria', autenticarUsuario, async (req, res) => {
    const { subcategoria } = req.params;
    const usuarioId = req.usuario?.id;
    const subcategoriaDecodificada = decodeURIComponent(subcategoria); // Decodifica categoria

    try {
        if (!subcategoriaDecodificada || !usuarioId) {
            return res.status(400).json({ error: "Subcategoria ou usuário não informado" });
        }

        const vendas = await pool.query(
            `SELECT vendas.id, vendas.quantidade, vendas.preco, produtos.nome AS produto, produtos.categoria, produtos.subcategoria, produtos.imagem
             FROM vendas
             JOIN produtos ON vendas.cod_produto = produtos.id
             WHERE produtos.subcategoria = $1 AND vendas.usuario_id = $2`,
            [subcategoriaDecodificada, usuarioId]
        );

        res.json(vendas.rows);
    } catch (err) {
        console.error("❌ Erro ao buscar vendas por categoria:", err);
        res.status(500).json({ error: "Erro ao buscar vendas por categoria" });
    }
});

router.get('/api/categorias/vendas', async (req, res) => {
    const { userId } = req.query; // ID do usuário vindo da query string

    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    try {
        const result = await pool.query(
            `SELECT DISTINCT p.categoria 
             FROM vendas v
             JOIN produtos p ON v.cod_produto = p.id
             WHERE v.usuario_id = $1`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erro ao buscar categorias de vendas:', error);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});

router.get('/api/subcategorias/vendas', async (req, res) => {
    const { userId } = req.query; // ID do usuário vindo da query string

    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    try {
        const result = await pool.query(
            `SELECT DISTINCT p.subcategoria 
             FROM vendas v
             JOIN produtos p ON v.cod_produto = p.id
             WHERE v.usuario_id = $1`,
            [userId]
        );


        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erro ao buscar categorias de vendas:', error);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});



module.exports = router;
