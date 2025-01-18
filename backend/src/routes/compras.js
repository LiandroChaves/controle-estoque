const express = require('express');
const pool = require('../database/db');
const { autenticarUsuario } = require('./login');
const router = express.Router();

router.post('/api/compras/:usuario_id', autenticarUsuario, async (req, res) => {
    const usuarioId = req.params.usuario_id;
    const { quantidade, id } = req.body; // Use 'id' no lugar de 'cod_produto'

    try {
        if (!quantidade || !id) { // Valide 'id'
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: quantidade e id' });
        }

        const result = await pool.query(`
            INSERT INTO compras (usuario_id, quantidade, cod_produto)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [usuarioId, quantidade, id]); // Use 'id' aqui

        res.status(201).json({ message: 'Compra realizada com sucesso', compra: result.rows[0] });
    } catch (err) {
        console.error('Erro ao realizar compra:', err);
        res.status(500).json({ error: 'Erro ao realizar compra' });
    }
});


module.exports = router;
