const sequelize = require('../config/database');
const Produto = require('./produtos');
const InformacoesLogin = require('./informacoeslogin');
const Venda = require('./venda');
const Compra = require('./compras');

// Relacionamentos
Produto.belongsTo(InformacoesLogin, { foreignKey: 'usuario_id' }); // Produto pertence a um usuário
Venda.belongsTo(Produto, { foreignKey: 'cod_produto' }); // Venda está associada a um produto
Venda.belongsTo(InformacoesLogin, { foreignKey: 'usuario_id' }); // Venda está associada a um usuário
Compra.belongsTo(Produto, { foreignKey: 'cod_produto' }); // Compra está associada a um produto
Compra.belongsTo(InformacoesLogin, { foreignKey: 'usuario_id' }); // Compra está associada a um usuário

// Exportação dos modelos e do sequelize
module.exports = { sequelize, Produto, InformacoesLogin, Venda, Compra };