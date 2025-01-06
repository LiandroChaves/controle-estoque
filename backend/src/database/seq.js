const { Sequelize } = require('sequelize');

// Configuração do Sequelize para ORM
const sequelize = new Sequelize('controle_estoque', 'controle_estoque', 'masterkey', {
    host: 'localhost', // Pode ser 127.0.0.1 também
    dialect: 'postgres',
    logging: console.log, // Ativa logs
    define: {
        timestamps: false, // Remove os campos `createdAt` e `updatedAt` de todos os modelos
    },
});

// Testa a conexão do Sequelize com o banco
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados via Sequelize foi bem-sucedida!');
    })
    .catch((err) => {
        console.error('Erro ao conectar no banco de dados via Sequelize:', err);
    });


// Exporta o pool e o Sequelize para reutilização em outros arquivos

module.exports = sequelize
