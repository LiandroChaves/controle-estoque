const { sequelize, Produto, InformacoesLogin, Venda, Compra } = require('./models');

(async () => {
  try {
    // Sincroniza o banco de dados
    await sequelize.sync({ force: true }); // Use `force: true` para recriar o banco a cada execução
    console.log('Banco sincronizado com sucesso!');

    // Insere dados iniciais em `informacoeslogin`
    const usuarios = [
      { login: 'joao.silva', senha: 'Joao@1234', nome: 'João Silva', empresa: 'TechNova Solutions' },
      { login: 'maria.souza', senha: 'Maria#2024!', nome: 'Maria Souza', empresa: 'InovaCorp Ltda' },
    ];
    await InformacoesLogin.bulkCreate(usuarios);
    console.log('Dados de login inseridos com sucesso!');

    // Insere dados iniciais em `produtos`
    const produtos = [
      { nome: 'Bomba de água', categoria: 'Peças', subcategoria: 'Carros', estoque: 28, preco: 75.0, catalogo: 'Catálogo Oficina', usuario_id: 1 },
      { nome: 'Batida de Morango', categoria: 'Drinks de Verão', subcategoria: 'Coquetéis', estoque: 20, preco: 24.9, catalogo: 'Catálogo Verão', favorito: true, usuario_id: 1 },
    ];
    await Produto.bulkCreate(produtos);
    console.log('Dados de produtos inseridos com sucesso!');

    // Insere dados iniciais em `vendas` (se necessário)
    const vendas = [
      { cod_produto: 1, quantidade: 5, preco: 375.0, usuario_id: 1 },
      { cod_produto: 2, quantidade: 3, preco: 74.7, usuario_id: 1 },
    ];
    await Venda.bulkCreate(vendas);
    console.log('Dados de vendas inseridos com sucesso!');

    console.log('Todos os dados iniciais foram inseridos com sucesso!');
  } catch (err) {
    console.error('Erro ao sincronizar banco ou inserir dados iniciais:', err);
  }
})();
