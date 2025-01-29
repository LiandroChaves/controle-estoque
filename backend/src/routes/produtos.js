const express = require('express');
const router = express.Router();
const pool = require('../database/db');

router.get(`/produtos/:usuario_id`, async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM produtos WHERE usuario_id = $1', [usuario_id]);

        // Atualiza cada produto para incluir a URL absoluta da imagem
        const produtos = result.rows.map((produto) => ({
            ...produto,
            imagem: produto.imagem ? `http://localhost:5000${produto.imagem}` : null,
        }));

        res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
            error: 'Erro ao consultar o banco de dados',
            message: error.message,
            stack: error.stack,
        });
    }
});


router.get('/produtos/favoritos/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM produtos WHERE usuario_id = $1 AND favorito = true',
            [usuario_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos favoritos:', error);
        res.status(500).json({
            error: 'Erro ao consultar o banco de dados',
            message: error.message,
            stack: error.stack,
        });
    }
});


router.get('/produtos/favoritosOrdenadosAtoZ/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM produtos WHERE usuario_id = $1 AND favorito = true ORDER BY nome ASC`,
            [usuario_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos favoritos ordenados:', error);
        res.status(500).json({
            error: 'Erro ao consultar o banco de dados',
            message: error.message,
            stack: error.stack,
        });
    }
});


router.get('/produtos/favoritosOrdenadosZtoA/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM produtos WHERE usuario_id = $1 AND favorito = true ORDER BY nome DESC`,
            [usuario_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos favoritos ordenados:', error);
        res.status(500).json({
            error: 'Erro ao consultar o banco de dados',
            message: error.message,
            stack: error.stack,
        });
    }
});



router.put('/produtos/:id/favorito', async (req, res) => {
    const { id } = req.params;
    const { favorito } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    try {
        const result = await pool.query(
            'UPDATE produtos SET favorito = $1 WHERE id = $2 RETURNING *',
            [favorito, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Status de favorito atualizado.', produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar status de favorito:', error);
        res.status(500).json({ error: 'Erro ao atualizar status de favorito.' });
    }
});


router.post('/produtos', async (req, res) => {
    const { nome, categoria, subcategoria, estoque, preco, catalogo, favorito } = req.body;

    if (!nome || !categoria || !subcategoria || !estoque || !preco) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios' });
    }

    const favoritoValue = favorito !== undefined ? favorito : false;

    try {
        const result = await pool.query(
            'INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome, categoria, subcategoria, estoque, preco, catalogo, favoritoValue]
        );

        res.status(201).json({ message: 'Produto inserido com sucesso', produto: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir o produto no banco de dados' });
    }
});


router.post('/produtos/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    const { nome, descricao, categoria, subcategoria, estoque, preco, catalogo, imagem, favorito } = req.body;

    if (!usuarioId || !nome || !categoria || !subcategoria || !estoque || !preco) {
        return res.status(400).json({ error: 'Faltam dados obrigatórios ou ID do usuário' });
    }

    const favoritoValue = favorito !== undefined ? favorito : false;

    try {
        const result = await pool.query(
            'INSERT INTO produtos (usuario_id, nome, descricao, categoria, subcategoria, estoque, preco, catalogo, imagem, favorito) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [usuarioId, nome, descricao, categoria, subcategoria, estoque, preco, catalogo, imagem, favoritoValue]
        );

        const produtoInserido = result.rows[0];

        // Insere registro no log
        await pool.query(
            'INSERT INTO logsprodutos (cod_produtos, acao) VALUES ($1, $2)',
            [produtoInserido.id, 'inserção']
        );

        res.status(201).json({ message: 'Produto inserido com sucesso', produto: produtoInserido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir o produto no banco de dados' });
    }
});


router.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { confirmar } = req.query; // Acessando o parâmetro da query string
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        console.log(`Forçando exclusão do produto com ID: ${id}`);

        // Exclui registros na tabela 'compras' que fazem referência ao produto
        await pool.query('DELETE FROM compras WHERE cod_produto = $1', [id]);
        // Exclui as vendas associadas ao produto
        await pool.query('DELETE FROM vendas WHERE cod_produto = $1', [id]);

        // Agora, exclui o produto
        const result = await pool.query(
            'DELETE FROM produtos WHERE id = $1 RETURNING *', [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const produtoExcluido = result.rows[0];

        // Insere registro no log
        await pool.query(
            'INSERT INTO logsprodutos (cod_produtos, acao) VALUES ($1, $2)',
            [produtoExcluido.id, 'exclusão']
        );

        console.log('Produto excluído com sucesso');
        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});


router.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, categoria, subcategoria, estoque, preco, imagem } = req.body;

    // Verificação dos campos obrigatórios
    if (!nome || !descricao || !categoria || !subcategoria || estoque === undefined || preco === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Atualização do produto no banco de dados
        const result = await pool.query(
            `UPDATE produtos
             SET nome = $1, descricao = $2, categoria = $3, subcategoria = $4, estoque = $5, preco = $6, imagem = $7
             WHERE id = $8 RETURNING *`,
            [nome, descricao, categoria, subcategoria, estoque, preco, imagem, id]
        );

        // Verificação se o produto foi encontrado
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        const produtoAtualizado = result.rows[0];

        // Insere registro no log
        await pool.query(
            'INSERT INTO logsprodutos (cod_produtos, acao) VALUES ($1, $2)',
            [produtoAtualizado.id, 'atualização']
        );

        console.log('Produto atualizado com sucesso:', produtoAtualizado);

        // Retorna a resposta com sucesso
        res.status(200).json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });
    } catch (error) {
        // Tratamento de erros gerais
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar o produto no banco de dados.' });
    }
});


router.post('/produtos/reset-sequence', async (req, res) => {
    try {
        await pool.query('ALTER SEQUENCE produtos_id_seq RESTART WITH 1');
        res.status(200).json({ message: 'Sequência reiniciada para 1' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao reiniciar a sequência' });
    }
});


router.get('/categorias', async (req, res) => {
    const { userId } = req.query; // ID do usuário da query string

    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    try {
        const result = await pool.query(
            'SELECT DISTINCT categoria FROM produtos WHERE usuario_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});


router.get('/subcategorias', async (req, res) => {
    const { userId } = req.query; // ID do usuário da query string

    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    try {
        const result = await pool.query(
            'SELECT DISTINCT subcategoria FROM produtos WHERE usuario_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
});


router.get('/produtos/ordenarAtoZ/:id', async (req, res) => {
    try {
        const usuarioId = req.params.id;  // Mudança para obter o valor do parâmetro de rota

        if (!usuarioId) {
            return res.status(400).json({ error: 'usuario_id é necessário.' });
        }

        // Aqui, adicionando o log da query para verificar o valor passado
        const result = await pool.query(`
            SELECT 
                nome,
                categoria,
                subcategoria,
                estoque,
                preco,
                favorito,
                imagem,
                descricao,
                catalogo
            FROM produtos
            WHERE usuario_id = $1
            ORDER BY nome ASC
        `, [usuarioId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao ordenar produtos:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao obter produtos ordenados.' });
    }
});


router.get('/produtos/ordenarZtoA/:id', async (req, res) => {
    try {
        const usuarioId = req.params.id;  // Mudança para obter o valor do parâmetro de rota

        if (!usuarioId) {
            return res.status(400).json({ error: 'usuario_id é necessário.' });
        }

        // Aqui, adicionando o log da query para verificar o valor passado
        const result = await pool.query(`
            SELECT 
                nome,
                categoria,
                subcategoria,
                estoque,
                preco,
                favorito,
                imagem,
                descricao,
                catalogo
            FROM produtos
            WHERE usuario_id = $1
            ORDER BY nome DESC
        `, [usuarioId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao ordenar produtos:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao obter produtos ordenados.' });
    }
});


router.get('/produtos/ordenarToNormal/:id', async (req, res) => {
    try {
        const usuarioId = req.params.id;  // Mudança para obter o valor do parâmetro de rota

        if (!usuarioId) {
            return res.status(400).json({ error: 'usuario_id é necessário.' });
        }

        const result = await pool.query(`
            SELECT 
                *
            FROM produtos
            WHERE usuario_id = $1
        `, [usuarioId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao remover ordem de produtos:', error.message, error.stack);
        res.status(500).json({ error: 'Erro ao obter produtos ordenados.' });
    }
});

module.exports = router;
