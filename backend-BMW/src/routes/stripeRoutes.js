const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Função para esperar um tempo determinado
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para tentar uma operação com retry
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.message.includes('rate limit') && i < maxRetries - 1) {
        await wait(delay * Math.pow(2, i)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

// Formatar produto para o frontend
const formatProduct = async (product) => {
  const prices = await stripe.prices.list({ product: product.id, limit: 1 });
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: prices.data[0]?.unit_amount || 0,
    priceId: prices.data[0]?.id,
    category: product.metadata.category || 'Outros',
    image: product.images?.[0] || '',
    isSelected: product.metadata.is_selected === 'true',
    buyerName: product.metadata.buyer_name || null,
    buyerEmail: product.metadata.buyer_email || null,
    active: product.active
  };
};

// Listar todos os presentes
router.get('/presents', async (req, res) => {
  try {
    const stripeProducts = await stripe.products.list({ limit: 100 });
    const formattedProducts = await Promise.all(
      stripeProducts.data.map(formatProduct)
    );
    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar um presente específico
router.get('/presents/:id', async (req, res) => {
  try {
    const product = await stripe.products.retrieve(req.params.id);
    const formattedProduct = await formatProduct(product);
    res.json(formattedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo presente
router.post('/presents', async (req, res) => {
  try {
    const { name, description = 'Presente para os noivos', price, category, image, currency = 'brl' } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !price) {
      return res.status(400).json({ 
        error: 'Nome e preço são campos obrigatórios' 
      });
    }

    const productData = {
      name,
      description: description || 'Presente para os noivos', // Garante que description nunca será vazio
      images: image ? [image] : undefined,
      metadata: { 
        category: category || 'Outros',
        is_selected: 'false'
      },
      default_price_data: {
        unit_amount: price,
        currency
      }
    };

    const product = await retryOperation(async () => {
      return await stripe.products.create(productData);
    });

    const formattedProduct = await formatProduct(product);
    res.status(201).json(formattedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar múltiplos presentes
router.post('/presents/batch', async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        error: 'O corpo da requisição deve conter um array de produtos'
      });
    }

    const createdProducts = [];
    
    // Criar produtos sequencialmente com delay para evitar rate limit
    for (const productData of products) {
      const { 
        name, 
        description = 'Presente para os noivos',
        price, 
        category, 
        image, 
        currency = 'brl' 
      } = productData;

      // Validação dos campos obrigatórios
      if (!name || !price) {
        return res.status(400).json({ 
          error: `Nome e preço são campos obrigatórios. Produto com erro: ${name || 'sem nome'}` 
        });
      }
      
      await wait(1000); // Espera 1 segundo entre cada criação
      
      const stripeProductData = {
        name,
        description: description || 'Presente para os noivos', // Garante que description nunca será vazio
        images: image ? [image] : undefined,
        metadata: { 
          category: category || 'Outros',
          is_selected: 'false'
        },
        default_price_data: {
          unit_amount: price,
          currency
        }
      };

      const product = await retryOperation(async () => {
        return await stripe.products.create(stripeProductData);
      });

      const formattedProduct = await formatProduct(product);
      createdProducts.push(formattedProduct);
    }

    res.status(201).json(createdProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um presente
router.put('/presents/:id', async (req, res) => {
  try {
    const { name, description, price, category, image, active } = req.body;
    
    const product = await retryOperation(async () => {
      // Atualizar produto
      const updateData = {
        name,
        description,
        images: image ? [image] : undefined,
        metadata: { category },
        active
      };

      return await stripe.products.update(req.params.id, updateData);
    });

    // Se houver novo preço, criar
    if (price) {
      await retryOperation(async () => {
        await stripe.prices.create({
          product: product.id,
          unit_amount: price,
          currency: 'brl'
        });
      });
    }

    const formattedProduct = await formatProduct(product);
    res.json(formattedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar compra de presente
router.post('/presents/:id/purchase', async (req, res) => {
  try {
    const { buyerName, buyerEmail } = req.body;
    
    const product = await retryOperation(async () => {
      return await stripe.products.update(req.params.id, {
        metadata: {
          is_selected: 'true',
          buyer_name: buyerName,
          buyer_email: buyerEmail
        }
      });
    });

    const formattedProduct = await formatProduct(product);
    res.json(formattedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar presentes comprados
router.get('/presents/purchased', async (req, res) => {
  try {
    const stripeProducts = await stripe.products.list({ limit: 100 });
    const formattedProducts = await Promise.all(
      stripeProducts.data
        .filter(product => product.metadata.is_selected === 'true')
        .map(formatProduct)
    );
    res.json(formattedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 