// ORDIN/backend/db.js

const { Pool } = require('pg');

// O Pool vai usar a variável DATABASE_URL do nosso arquivo .env automaticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões com bancos na nuvem como Supabase/Heroku
  }
});

module.exports = {
  // Exportamos um método query para que possamos usá-lo em qualquer lugar do nosso app
  query: (text, params) => pool.query(text, params),
};