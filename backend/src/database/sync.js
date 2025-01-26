const { sequelize, Produto, InformacoesLogin, Venda, Compra } = require('./models');

(async () => {
  try {
    // Sincroniza o banco de dados
    await sequelize.sync({ force: true }); // Use `force: true` para recriar o banco a cada execução
    console.log('Banco sincronizado com sucesso!');

    // Insere dados iniciais em `informacoeslogin`
    const usuarios = [
      { login: 'joao.silva', senha: 'Joao@1234', nome: 'João Silva', empresa: 'TechNova Solutions' },
      { login: 'LChaveszzz', senha: 'Lc+lf@123', nome: 'Liandro Chaves', empresa: ' L&FTecnologies' },
    ];
    await InformacoesLogin.bulkCreate(usuarios);
    console.log('Dados de login inseridos com sucesso!');

    // Insere dados iniciais em `produtos`
    const produtos = [
        { nome: 'Bomba de água', categoria: 'Peças', subcategoria: 'Carros', estoque: 28, preco: 75.0, catalogo: 'Catálogo Oficina', usuario_id: 1 },
        { nome: 'Batida de Morango', categoria: 'Drinks de Verão', subcategoria: 'Coquetéis', estoque: 20, preco: 24.9, catalogo: 'Catálogo Verão', favorito: true, usuario_id: 1 },
        { nome: 'Notebook Dell Inspiron', categoria: 'Informática', subcategoria: 'Notebooks', estoque: 25, preco: 4999.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Monitor LG 24" Full HD', categoria: 'Informática', subcategoria: 'Monitores', estoque: 30, preco: 1199.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Teclado Mecânico Redragon', categoria: 'Periféricos', subcategoria: 'Teclados', estoque: 40, preco: 299.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Mouse Gamer Logitech G502', categoria: 'Periféricos', subcategoria: 'Mouses', estoque: 50, preco: 349.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Câmera Logitech C920 HD', categoria: 'Periféricos', subcategoria: 'Webcams', estoque: 20, preco: 499.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'SSD Kingston 1TB', categoria: 'Armazenamento', subcategoria: 'SSDs', estoque: 35, preco: 649.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'HD Externo Seagate 2TB', categoria: 'Armazenamento', subcategoria: 'HDs Externos', estoque: 25, preco: 599.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'iPhone 14', categoria: 'Smartphones', subcategoria: 'Apple', estoque: 10, preco: 7999.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Samsung Galaxy S22', categoria: 'Smartphones', subcategoria: 'Android', estoque: 15, preco: 5999.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Fone de Ouvido JBL Tune', categoria: 'Áudio', subcategoria: 'Fones Bluetooth', estoque: 60, preco: 299.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Caixa de Som Alexa Echo', categoria: 'Áudio', subcategoria: 'Assistentes Virtuais', estoque: 40, preco: 399.0, catalogo: 'Não', favorito: false, usuario_id: 2,descricao: 'A Caixa de Som Alexa Echo é a combinação perfeita de tecnologia, elegância e praticidade. Com um design moderno que se adapta a qualquer ambiente, ela oferece um som poderoso e claro, ideal para transformar sua experiência de áudio em casa. Além de ser uma caixa de som de alta qualidade, a Alexa Echo é sua assistente pessoal, permitindo que você controle músicas, obtenha informações em tempo real, automatize dispositivos inteligentes e mantenha sua rotina organizada apenas com a sua voz. É mais do que um dispositivo; é a conexão perfeita entre inovação e comodidade no seu dia a dia.', imagem: "/uploads/alexa.jpg" },
        { nome: 'Placa de Vídeo RTX 3060', categoria: 'Hardware', subcategoria: 'Placas de Vídeo', estoque: 12, preco: 2499.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Processador Ryzen 5 5600X', categoria: 'Hardware', subcategoria: 'Processadores', estoque: 18, preco: 1099.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Smart TV Samsung 50" 4K', categoria: 'Eletrônicos', subcategoria: 'TVs', estoque: 8, preco: 3499.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Drone DJI Mini 2', categoria: 'Eletrônicos', subcategoria: 'Drones', estoque: 6, preco: 3999.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Impressora HP Deskjet', categoria: 'Escritório', subcategoria: 'Impressoras', estoque: 22, preco: 749.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Pen Drive SanDisk 128GB', categoria: 'Armazenamento', subcategoria: 'Pen Drives', estoque: 100, preco: 79.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Carregador MagSafe', categoria: 'Acessórios', subcategoria: 'Apple', estoque: 30, preco: 199.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
        { nome: 'Cabo HDMI 2.1 3M', categoria: 'Acessórios', subcategoria: 'Cabos', estoque: 80, preco: 49.0, catalogo: 'Não', favorito: false, usuario_id: 2 },
        { nome: 'Roteador TP-Link AX3000', categoria: 'Redes', subcategoria: 'Roteadores', estoque: 25, preco: 399.0, catalogo: 'Não', favorito: true, usuario_id: 2 },
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
