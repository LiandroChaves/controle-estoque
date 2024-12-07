const express = require("express");
const pool = require("../database/db");
const router = express.Router();

router.post("/cadastro", async (req, res) => {
    const { login, senha, nome, empresa } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO informacoesLogin (login, senha, nome, empresa) VALUES ($1, $2, $3, $4) RETURNING *", 
            [login, senha, nome, empresa]
        );

        res.status(201).json({
            message: "Usuário inserido com sucesso!",
            usuario: result.rows[0],
        });
    } catch (error) {
        console.error("Erro ao inserir novo usuário: ", error.message);

        res.status(500).json({ 
            error: "Erro ao inserir novo usuário. Por favor, tente novamente."
        });
    }
});

module.exports = router;
