const { pool, query } = require('../config/database');

const initDatabase = async () => {
  try {
    // Create tables
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS presents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables created');

    // Create default admin
    await query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['admin', 'admin123']
    );
    console.log('Default admin created');

    // Create sample presents
    const presents = [
      {
        title: 'Smart TV 55"',
        description: 'Smart TV LED 55 polegadas com resolução 4K',
        price: 2999.99,
        category: 'Eletrônicos',
        image: 'https://example.com/tv.jpg',
      },
      {
        title: 'Jogo de Panelas',
        description: 'Conjunto de panelas antiaderentes com 5 peças',
        price: 499.99,
        category: 'Casa',
        image: 'https://example.com/pan.jpg',
      },
      {
        title: 'Cafeteira',
        description: 'Cafeteira expresso automática',
        price: 799.99,
        category: 'Eletrodomésticos',
        image: 'https://example.com/coffee.jpg',
      },
    ];

    for (const present of presents) {
      await query(
        'INSERT INTO presents (title, description, price, category, image) VALUES ($1, $2, $3, $4, $5)',
        [present.title, present.description, present.price, present.category, present.image]
      );
    }
    console.log('Sample presents created');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
};

initDatabase(); 