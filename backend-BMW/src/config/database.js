const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'danielmarques',
  password: process.env.DB_PASSWORD || 'apple',
  database: process.env.DB_NAME || 'be_my_wife',
});

// Função para inicializar o banco de dados
const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Lê e executa o arquivo SQL de inicialização
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    client.release();
  } catch (err) {
    console.error('❌ Erro ao inicializar o banco de dados:', err.message);
    throw err;
  }
};

// Função para executar queries
const query = async (text, params) => {
  try {
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    return result;
  } catch (err) {
    console.error('❌ Erro ao executar query:', err.message);
    throw err;
  }
};

module.exports = {
  pool,
  query,
  initDatabase
};