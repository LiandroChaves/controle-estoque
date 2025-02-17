const express = require("express");
const pool = require("../database/db");
const router = express.Router();

router.post("/finalizarvenda", async (req, res) => {
    try {
        const { vendas } = req.body;

        if (!Array.isArray(vendas) || vendas.length === 0) {
            return res.status(400).json({ error: "Nenhuma venda enviada." });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN"); // Inicia a transação

            for (const venda of vendas) {
                const { vendaId, desconto, formaPagamento } = venda;

                if (!formaPagamento) {
                    throw new Error(`Forma de pagamento não informada para a venda ${vendaId}.`);
                }

                // Garantindo que o desconto seja válido
                const descontoValido = Math.max(0, Math.min(desconto, 100));

                // Busca a venda e o produto relacionado
                const result = await client.query(
                    "SELECT v.id, v.preco, p.nome FROM vendas v JOIN produtos p ON v.cod_produto = p.id WHERE v.id = $1",
                    [vendaId]
                );

                if (result.rows.length === 0) {
                    throw new Error(`Venda ID ${vendaId} não encontrada.`);
                }

                const { preco, nome } = result.rows[0];
                const valorFinal = preco * (1 - descontoValido / 100); // Aplica o desconto corretamente

                // Insere a venda finalizada no banco
                await client.query(
                    `INSERT INTO finalizarvendas 
                    (venda_id, nome_produto, preco, desconto, valor_final, forma_pagamento, data_finalizacao) 
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                    [vendaId, nome, preco, descontoValido, valorFinal, formaPagamento]
                );
            }

            await client.query("COMMIT"); // Confirma a transação
            res.status(201).json({ message: "Todas as vendas foram finalizadas com sucesso!" });

        } catch (error) {
            await client.query("ROLLBACK"); // Desfaz a transação em caso de erro
            console.error("Erro ao finalizar vendas:", error.message);
            res.status(400).json({ error: error.message });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

router.post("/finalizarvendaUnica", async (req, res) => {
    try {
        const { vendaId, desconto, formaPagamento } = req.body;

        if (!vendaId || desconto === undefined || !formaPagamento) {
            return res.status(400).json({ error: "Dados inválidos. Verifique a venda selecionada." });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN"); // Inicia a transação

            // Garantindo que o desconto seja um valor válido (0 a 100)
            const descontoValido = Math.max(0, Math.min(desconto, 100));

            // Busca a venda e o produto relacionado
            const result = await client.query(
                "SELECT v.id, v.preco, p.nome FROM vendas v JOIN produtos p ON v.cod_produto = p.id WHERE v.id = $1",
                [vendaId]
            );

            if (result.rows.length === 0) {
                throw new Error(`Venda ID ${vendaId} não encontrada.`);
            }

            const { preco, nome } = result.rows[0];
            const valorFinal = preco * (1 - descontoValido / 100); // Aplica o desconto corretamente

            // Insere a venda finalizada no banco
            await client.query(
                `INSERT INTO finalizarvendas 
                (venda_id, nome_produto, preco, desconto, valor_final, forma_pagamento, data_finalizacao) 
                VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [vendaId, nome, preco, descontoValido, valorFinal, formaPagamento]
            );

            await client.query("COMMIT"); // Confirma a transação
            res.status(201).json({ message: "Venda finalizada com sucesso!" });

        } catch (error) {
            await client.query("ROLLBACK"); // Desfaz a transação em caso de erro
            console.error("Erro ao finalizar venda:", error.message);
            res.status(400).json({ error: error.message });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
