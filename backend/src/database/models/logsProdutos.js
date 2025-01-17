const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const logsProdutos = sequelize.define('logsprodutos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cod_produtos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  acao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'logsprodutos',
});

module.exports = logsProdutos;
