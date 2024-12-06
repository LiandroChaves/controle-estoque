const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Rota para listar os produtos
// Rota para listar os produtos
// Rota para listar os produtos
router.get('/produtos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM produtos');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error); // Log detalhado
      res.status(500).json({
        error: 'Erro ao consultar o banco de dados',
        message: error.message,  // Mostra a mensagem do erro
        stack: error.stack,      // Mostra o stack trace completo para depuração
      });
    }
  });
  
  

// Rota para criar um novo produto
router.post('/produtos', async (req, res) => {
  const { nome, categoria, subcategoria, estoque, preco, catalogo, favorito } = req.body;

  // Verificando se os campos obrigatórios foram fornecidos
  if (!nome || !categoria || !subcategoria || !estoque || !preco) {
    return res.status(400).json({ error: 'Faltam dados obrigatórios' });
  }

  // Define o valor padrão para 'favorito' se não for informado
  const favoritoValue = favorito !== undefined ? favorito : false;

  try {
    // Inserir o produto no banco de dados
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

module.exports = router;
