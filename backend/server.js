const express = require('express');
const produtosRouter = require('./src/routes/produtos');
const loginRouter = require("./src/routes/login");
const cadastroRouter = require("./src/routes/cadastro")
const cors = require('cors');
const pool = require('./src/database/db');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT','DELETE'],
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

app.use('/api', produtosRouter);
app.use("/api", loginRouter);
app.use("/api", cadastroRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
