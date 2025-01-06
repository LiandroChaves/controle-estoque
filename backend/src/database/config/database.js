const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('controle_estoque', 'controle_estoque', 'masterkey', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
