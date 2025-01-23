const express = require('express');
const { autenticarUsuario } = require('./login');
const Produto = require('../database/models/produtos'); // Importando o modelo Produto
const Compra = require('../database/models/compras');  // Importando o modelo Compra
const pool = require('../database/db');

const router = express.Router();

router.post("/api/compras/verificarsenha", autenticarUsuario, async (req, res) => {
    console.log("Dados do token:", req.usuario); // Loga o usuário autenticado
    console.log("Senha recebida:", req.body.senha); // Loga a senha recebida no corpo

    const { senha } = req.body;

    if (!senha) {
        return res.status(400).json({ error: "Senha é obrigatória." });
    }

    try {
        const login = req.usuario?.login; // Pegue o login decodificado do token
        console.log("Login extraído do token:", login);

        if (!login) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        const result = await pool.query(
            "SELECT senha FROM informacoeslogin WHERE login = $1",
            [login]
        );

        console.log("Resultado da consulta:", result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const senhaBD = result.rows[0].senha;

        if (senha !== senhaBD) {
            return res.status(401).json({ error: "Senha incorreta." });
        }

        res.status(200).json({ message: "Senha válida." });
    } catch (error) {
        console.error("Erro ao verificar senha:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});


router.post('/api/compras/:usuario_id', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;
    const { quantidade, id } = req.body; // Use 'id' no lugar de 'cod_produto'

    try {
        if (!quantidade || !id) { // Valide 'id' e 'quantidade'
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: quantidade e id' });
        }

        // Buscando o preço do produto
        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Calculando o preço total
        const precoTotal = produto.preco * quantidade;

        // Usando o Sequelize para criar a compra (isso ativa os hooks)
        const compra = await Compra.create({
            usuario_id: usuarioId,
            quantidade: quantidade,
            cod_produto: id,
            preco: precoTotal
        });

        res.status(201).json({ message: 'Compra realizada com sucesso', compra });
    } catch (err) {
        console.error('Erro ao realizar compra:', err);
        res.status(500).json({ error: 'Erro ao realizar compra' });
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

module.exports = router;
