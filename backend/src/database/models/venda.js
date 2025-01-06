const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const venda = sequelize.define('vendas', {
  cod_produto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos', // Nome da tabela de referência
      key: 'id',
    },
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'informacoeslogin',
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'vendas',
});

module.exports = venda;
