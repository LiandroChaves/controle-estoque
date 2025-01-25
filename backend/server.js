const express = require('express');
const produtosRouter = require('./src/routes/produtos');
const { router: loginRouter } = require('./src/routes/login');
const cadastroRouter = require("./src/routes/cadastro");
const vendasRouter = require("./src/routes/vendas");
const comprasRouter = require("./src/routes/compras");
const uploadRouter = require("./src/routes/upload");
const cors = require('cors');
const pool = require('./src/database/db');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const testDatabaseConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Conexão com o banco de dados bem-sucedida:', result.rows[0]);
    } catch (err) {
        console.error('Erro de conexão com o banco de dados:', err);
    }
};

testDatabaseConnection();

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', produtosRouter);
app.use("/api", loginRouter);
app.use("/api", cadastroRouter);
app.use("/api", uploadRouter);
app.use(vendasRouter);
app.use(comprasRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
