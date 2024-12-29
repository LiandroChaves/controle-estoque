const express = require('express');
const pool = require('../database/db');
const { autenticarUsuario } = require('./login');
const router = express.Router();

router.get('/api/vendas/:usuario_id', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;

    try {
        // Comparando o ID do usuário
        if (parseInt(usuarioId, 10) !== req.usuario.id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        
        // Consulta ao banco de dados para buscar as vendas
        const vendas = await pool.query(`
            SELECT vendas.id, vendas.quantidade, vendas.preco, produtos.nome AS produto, produtos.categoria
            FROM vendas
            JOIN produtos ON vendas.cod_produto = produtos.id
            WHERE vendas.usuario_id = $1
        `, [usuarioId]);
        
        // Retorna as vendas com as informações do produto
        res.json(vendas.rows);  
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
});

module.exports = router;
