const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produto = require('./produtos');
const InformacoesLogin = require('./informacoeslogin');
const Venda = require('./venda');

const Compra = sequelize.define(
  'compras',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cod_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos', // Nome da tabela relacionada
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
    data_compra: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    tableName: 'compras',
    hooks: {
      // Preenche o preço antes de criar a compra (usando 'beforeCreate' em vez de 'afterValidate')
      beforeCreate: async (compra, options) => {
        try {
          const produto = await Produto.findByPk(compra.cod_produto);
          if (produto) {
            // Verifica se o preço do produto é válido
            if (!produto.preco || produto.preco <= 0) {
              throw new Error(`Preço do produto ID ${produto.id} é inválido.`);
            }
      
            // Atribui o preço total baseado no preço do produto
            compra.preco = produto.preco * compra.quantidade;
          } else {
            throw new Error('Produto não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar o produto ou atualizar o preço:', error);
          throw error;
        }
      },
      
      // Após criar a compra, atualiza o estoque e registra a venda
      afterCreate: async (compra, options) => {
        try {
          // Atualiza o estoque do produto relacionado
          const produto = await Produto.findByPk(compra.cod_produto);
          if (produto) {
            const novoEstoque = produto.estoque - compra.quantidade;
            if (novoEstoque < 0) {
              throw new Error(
                `Estoque insuficiente para o produto ID ${produto.id}`
              );
            }
            await produto.update({ estoque: novoEstoque });

            // Registra a venda automaticamente
            await Venda.create({
              cod_produto: compra.cod_produto,
              quantidade: compra.quantidade,
              preco: compra.preco, // O preço já está correto aqui
              usuario_id: compra.usuario_id,
            });
            console.log('Venda registrada e estoque atualizado com sucesso!');
          }
        } catch (error) {
          console.error('Erro ao registrar venda ou atualizar estoque:', error);
          throw error;
        }
      },
    },
  }
);

// Relacionamentos
Compra.belongsTo(Produto, {
  foreignKey: 'cod_produto',
});
Compra.belongsTo(InformacoesLogin, {
  foreignKey: 'usuario_id',
});

module.exports = Compra;
