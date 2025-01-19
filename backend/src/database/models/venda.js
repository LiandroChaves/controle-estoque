const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produto = require('./produtos');

const Venda = sequelize.define(
  'vendas',
  {
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
  },
  {
    timestamps: false,
    tableName: 'vendas',
    hooks: {
      // Hook para restaurar o estoque antes de excluir a venda
      beforeDestroy: async (venda, options) => {
        try {
          // Localiza o produto relacionado à venda
          const produto = await Produto.findByPk(venda.cod_produto);
          if (produto) {
            // Atualiza o estoque restaurando a quantidade da venda
            await produto.update({
              estoque: produto.estoque + venda.quantidade,
            });
            console.log(
              `Estoque do produto ID ${produto.id} restaurado com sucesso!`
            );
          } else {
            throw new Error('Produto não encontrado');
          }
        } catch (error) {
          console.error('Erro ao restaurar o estoque:', error);
          throw error;
        }
      },
    },
  }
);

// Exporta o modelo
module.exports = Venda;
