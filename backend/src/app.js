const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoutes = require("./routes/login");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/login", loginRoutes);

module.exports = app;
