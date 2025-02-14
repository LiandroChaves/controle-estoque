const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venda = require('./venda'); // Importando o modelo de vendas

const FinalizarVendas = sequelize.define(
  'FinalizarVendas',
  {
    venda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vendas', // Nome da tabela de referência
        key: 'id',
      },
    },
    nome_produto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    desconto: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    valor_final: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    forma_pagamento: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    data_finalizacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'finalizarvendas',
    hooks: {
      // Hook para realizar algum tipo de operação antes de criar o registro
      beforeCreate: async (finalizarVenda, options) => {
        try {
          // Localiza a venda associada ao finalizarVenda
          const venda = await Venda.findByPk(finalizarVenda.venda_id);
          if (venda) {
            // Calcula o valor final com o desconto
            finalizarVenda.valor_final = venda.preco - (venda.preco * finalizarVenda.desconto / 100);
            console.log(`Valor final calculado para a venda ID ${venda.id}: ${finalizarVenda.valor_final}`);
          } else {
            throw new Error('Venda não encontrada');
          }
        } catch (error) {
          console.error('Erro ao calcular valor final:', error);
          throw error;
        }
      },
    },
  }
);

// Exporta o modelo
module.exports = FinalizarVendas;
