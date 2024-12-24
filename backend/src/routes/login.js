const express = require('express');
const pool = require('../database/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta';

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

        const token = jwt.sign(
            { id: usuario.id, login: usuario.login },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            nome: usuario.nome,
            empresa: usuario.empresa,
        });
    } catch (error) {
        console.error("Erro ao autenticar o usuário:", error.message);
        res.status(500).json({ error: "Erro interno ao autenticar o usuário" });
    }
});

router.get('/login', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log('Token recebido:', token);

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Verifica o token JWT
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token decodificado:', decoded);

        const login = decoded.login;

        // Busca os dados do usuário no banco
        const result = await pool.query('SELECT * FROM informacoesLogin WHERE login = $1', [login]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];
        res.json(usuario);

    } catch (error) {
        console.error('Erro ao verificar o token ou buscar os dados do usuário:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
        res.status(500).json({ error: 'Erro interno ao autenticar o usuário' });
    }
});






module.exports = router;



