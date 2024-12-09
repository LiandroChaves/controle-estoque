const express = require('express');
const router = express.Router();
const pool = require('../database/db');

router.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
            error: 'Erro ao consultar o banco de dados',
            message: error.message,
            stack: error.stack,
        });
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
            'INSERT INTO produtos (nome, categoria, subcategoria, estoque, preco, catalogo, favorito) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, categoria, subcategoria, estoque, preco, catalogo, favoritoValue]
        );

        res.status(201).json({ message: 'Produto inserido com sucesso', produto: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir o produto no banco de dados' });
    }
});


router.delete('/produtos', async (req, res) => {
    try {
        await pool.query('DELETE FROM produtos');
        res.status(200).json({ message: 'Todos os produtos foram excluídos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir produtos' });
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


router.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, subcategoria, estoque, preco } = req.body;

    if (!nome || !categoria || !subcategoria || estoque === undefined || preco === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, categoria = $2, subcategoria = $3, estoque = $4, preco = $5 WHERE id = $6 RETURNING *',
            [nome, categoria, subcategoria, estoque, preco, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        res.status(200).json({ message: 'Produto atualizado com sucesso', produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar o produto no banco de dados.' });
    }
});


module.exports = router;
