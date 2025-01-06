const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const produto = sequelize.define('produtos', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: DataTypes.STRING,
  subcategoria: DataTypes.STRING,
  estoque: DataTypes.INTEGER,
  preco: DataTypes.DECIMAL(10, 2),
  catalogo: DataTypes.STRING,
  favorito: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'informacoeslogin', // Nome da tabela de referência
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'produtos',
});

module.exports = produto;
