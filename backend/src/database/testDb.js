const pool = require('./db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão bem-sucedida:', res.rows[0]);
    pool.end();
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
})();
