const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// Rota para buscar as informações
router.get("/informacoes", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM informacoes");
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar informações no banco de dados:", error.message);
      res.status(500).json({ error: "Erro ao buscar informações no banco de dados" });
    }
});
  
module.exports = router;
