const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const informacoeslogin = sequelize.define('informacoeslogin', {
    login: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagem: {
       type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'informacoeslogin',  // Nome da tabela em minúsculas
  });
  

module.exports = informacoeslogin;
