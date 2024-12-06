const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const produtosRoutes = require('./routes/produtos');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/produtos', produtosRoutes);

module.exports = app;
