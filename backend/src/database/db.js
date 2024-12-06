const { Pool } = require('pg');

const pool = new Pool({
  user: 'controle_estoque', 
  host: 'localhost',
  database: 'controle_estoque', 
  password: 'masterkey', 
  port: 5432, 
});

module.exports = pool;
