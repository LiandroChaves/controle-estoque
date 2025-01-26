const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const logsProdutos = require('./logsProdutos'); // Importa o model de logs

const Produto = sequelize.define('produtos', {
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
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'produtos',
  hooks: {
    // Hook para capturar após criar um produto
    afterCreate: async (produto, options) => {
      try {
        await logsProdutos.create({
          cod_produtos: produto.id,
          acao: 'INSERT',
        });
        console.log('Log de criação registrado com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar log de criação:', error);
      }
    },
    // Hook para capturar após atualizar um produto
    afterUpdate: async (produto, options) => {
      try {
        await logsProdutos.create({
          cod_produtos: produto.id,
          acao: 'UPDATE',
        });
        console.log('Log de atualização registrado com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar log de atualização:', error);
      }
    },
    // Hook para capturar após excluir um produto
    afterDestroy: async (produto, options) => {
      try {
        await logsProdutos.create({
          cod_produtos: produto.id,
          acao: 'DELETE',
        });
        console.log('Log de exclusão registrado com sucesso!');
      } catch (error) {
        console.error('Erro ao registrar log de exclusão:', error);
      }
    },
  },
});

module.exports = Produto;
