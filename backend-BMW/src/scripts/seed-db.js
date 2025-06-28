const { query, initDatabase } = require('../config/database');

const samplePresents = [
  {
    title: 'Jogo de Panelas Premium',
    description: 'Conjunto de 5 panelas antiaderentes com revestimento cerâmico',
    price: 89990, // em centavos
    category: 'Cozinha',
    image: '/source/presents/pan.jpg'
  },
  {
    title: 'Cama King Size',
    description: 'Cama king size com cabeceira estofada e estrutura em madeira',
    price: 249990,
    category: 'Quarto',
    image: '/source/presents/bed.jpg'
  },
  {
    title: 'Sofá 3 Lugares',
    description: 'Sofá retrátil com 3 lugares em tecido premium',
    price: 199990,
    category: 'Sala',
    image: '/source/presents/sofa.jpg'
  },
  {
    title: 'Jogo de Toalhas',
    description: 'Conjunto com 6 toalhas de banho em algodão egípcio',
    price: 29990,
    category: 'Banheiro',
    image: '/source/presents/towels.jpg'
  },
  {
    title: 'Mesa de Jantar',
    description: 'Mesa de jantar para 6 pessoas em madeira maciça',
    price: 159990,
    category: 'Sala',
    image: '/source/presents/table.jpg'
  },
  {
    title: 'Luminária de Mesa',
    description: 'Luminária de mesa com design moderno e regulagem de intensidade',
    price: 19990,
    category: 'Decoração',
    image: '/source/presents/lamp.jpg'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando processo de seed do banco de dados...');
    
    // Inicializar banco (criar tabelas se não existirem)
    await initDatabase();
    
    // Limpar dados existentes
    await query('DELETE FROM presents');
    console.log('🗑️  Dados antigos removidos');
    
    // Inserir novos dados
    for (const present of samplePresents) {
      await query(
        'INSERT INTO presents (title, description, price, category, image) VALUES ($1, $2, $3, $4, $5)',
        [present.title, present.description, present.price, present.category, present.image]
      );
    }
    
    console.log(`✅ ${samplePresents.length} presentes inseridos com sucesso!`);
    
    // Verificar dados inseridos
    const result = await query('SELECT COUNT(*) FROM presents');
    console.log(`📊 Total de presentes no banco: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
};

seedDatabase(); 