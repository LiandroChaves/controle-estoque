const express = require('express');
const pool = require('../database/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { login, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM informacoesLogin WHERE login = $1', [login]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const usuario = result.rows[0];

        if (senha !== usuario.senha) {
            console.log("Senhas não são iguais!");
            return res.status(401).json({ error: "Senha inválida" });
        }

        res.json({
            nome: usuario.nome,
            empresa: usuario.empresa,
        });
    } catch (error) {
        console.error("Erro ao autenticar o usuário:", error.message);
        res.status(500).json({ error: "Erro interno ao autenticar o usuário" });
    }
});

router.get('/login', async (req, res) =>{
    try {
        const result = await pool.query('SELECT login, senha from informacoesLogin');
        res.json(result.rows);
    } catch (error) {
        console.log('Erro ao pegar dados de logins cadastrados: ' + error.message);
    }
});


module.exports = router;



