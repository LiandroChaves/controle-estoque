const express = require('express');
const pool = require('../database/db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = 'sua_chave_secreta';

// Middleware de autenticação
const autenticarUsuario = (req, res, next) => {
    // Extrai o token do cabeçalho Authorization (espera o formato "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    try {
        // Verifica o token e decodifica
        const decoded = jwt.verify(token, SECRET_KEY); 
        req.usuario = decoded; // Armazena os dados do usuário no req.usuario
        next(); // Chama a próxima função/middleware
    } catch (error) {
        console.error('Erro ao verificar token:', error.message);
        
        if (error.name === 'jwt expired') {
            return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
        }

        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

// Rota de login
router.post('/login', async (req, res) => {
    const { login, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM informacoesLogin WHERE login = $1', [login]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const usuario = result.rows[0];

        if (senha !== usuario.senha) {
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

// Rota de verificação do login
router.get('/login', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log('Token recebido:', token);

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token decodificado:', decoded);

        const login = decoded.login;

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
        if (res.status === 401) {
            alert("Sua sessão expirou. Faça login novamente.");
            window.location.href = "/login";
            return;
        }
        res.status(500).json({ error: 'Erro interno ao autenticar o usuário' });
    }
});

module.exports = { router, autenticarUsuario }; 
