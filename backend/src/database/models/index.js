const sequelize = require('../config/database');
const produto = require('./produtos');
const informacoeslogin = require('./informacoesLogin');
const venda = require('./venda');

// Relações
produto.belongsTo(informacoeslogin, { foreignKey: 'usuario_id' });
venda.belongsTo(produto, { foreignKey: 'cod_produto' });
venda.belongsTo(informacoeslogin, { foreignKey: 'usuario_id' });

module.exports = { sequelize, produto, informacoeslogin, venda };
