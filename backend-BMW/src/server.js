const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./config/database');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();

// Middleware cors
app.use(cors());

// ATENÇÃO: essa rota '/api/webhook' precisa estar antes do uso de app.use(express.json());
// pois a stripe precisa que os dados do webhook não sejam pré processados
// os dados devem estar em formato raw
// por isso não pode ser processado pelo express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), stripeRoutes.webhookHandler);

// Middleware json() parse
app.use(express.json());

// Routes
app.use('/api', stripeRoutes.router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar o servidor:', error.message);
    process.exit(1);
  }
};

startServer(); 