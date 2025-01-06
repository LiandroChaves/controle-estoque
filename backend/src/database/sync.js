const { sequelize, produto, informacoeslogin, venda } = require('./models');

sequelize.sync({ force: true }) // Use `force: true` para recriar o banco
    .then(async () => {
        console.log('Banco sincronizado com sucesso!');

        // Insere dados iniciais (exemplo)
        await informacoeslogin.bulkCreate([
            { login: 'joao.silva', senha: 'Joao@1234', nome: 'João Silva', empresa: 'TechNova Solutions' },
            { login: 'maria.souza', senha: 'Maria#2024!', nome: 'Maria Souza', empresa: 'InovaCorp Ltda' },
        ])
            .then(() => {
                console.log('Dados de login inseridos com sucesso!');
            })
            .catch((err) => {
                console.error('Erro ao inserir dados de login:', err);
            });

        await produto.bulkCreate([
            { nome: 'Bomba de água', categoria: 'Peças', subcategoria: 'Carros', estoque: 28, preco: 75, catalogo: 'Catálogo Oficina', usuario_id: 1 },
            { nome: 'Batida de Morango', categoria: 'Drinks de Verão', subcategoria: 'Coquetéis', estoque: 20, preco: 24.90, catalogo: 'Catálogo Verão', favorito: true, usuario_id: 1 },
        ])
        .then(() => {
            console.log('Dados de produto inseridos com sucesso!');
        })
        .catch((err) => {
            console.error('Erro ao inserir dados de produto:', err);
        });

        console.log('Dados iniciais inseridos com sucesso!');
    })
    .catch((err) => console.error('Erro ao sincronizar banco:', err));
