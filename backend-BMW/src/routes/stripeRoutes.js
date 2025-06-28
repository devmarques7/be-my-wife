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

// Endpoint de teste para verificar configuração do Stripe
router.get('/health', async (req, res) => {
  try {
    console.log('🔍 Verificando configuração do Stripe...');
    
    // Verificar chaves
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const secretKeyValid = hasSecretKey && process.env.STRIPE_SECRET_KEY.startsWith('sk_');
    
    // Teste simples: listar produtos
    const products = await stripe.products.list({ limit: 1 });
    
    const status = {
      stripe_configured: hasSecretKey && secretKeyValid,
      secret_key_present: hasSecretKey,
      secret_key_format: secretKeyValid,
      api_connection: true,
      products_accessible: products.data !== undefined,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Status do Stripe:', status);
    
    res.json({
      status: 'healthy',
      stripe: status
    });
  } catch (error) {
    console.error('❌ Erro na verificação do Stripe:', error.message);
    res.status(500).json({
      status: 'error',
      error: error.message,
      type: error.type || 'unknown'
    });
  }
});

// Criar Payment Intent para Stripe Elements
router.post('/presents/create-payment-intent', async (req, res) => {
  try {
    // Verificar se as chaves do Stripe estão configuradas
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY não configurada!');
      return res.status(500).json({ 
        error: 'Chave secreta do Stripe não configurada no servidor',
        type: 'server_configuration_error'
      });
    }

    const { productIds, customerInfo } = req.body;

    // Validação de entrada
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ 
        error: 'Forneça uma lista válida de IDs de produtos',
        type: 'validation_error'
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({ 
        error: 'Informações do cliente (nome e email) são obrigatórias',
        type: 'validation_error'
      });
    }

    console.log('🎁 Products IDs recebidos:', productIds);
    console.log('👤 Informações do cliente:', customerInfo);
    console.log('🔄 Iniciando criação do Payment Intent...');

    // Calcular o total dos produtos
    let totalAmount = 0;
    const productDetails = [];
    
    for (const productId of productIds) {
      try {
        const product = await stripe.products.retrieve(productId);
        const prices = await stripe.prices.list({ 
          product: productId, 
          limit: 1,
          active: true 
        });
        
        if (prices.data.length > 0) {
          totalAmount += prices.data[0].unit_amount;
          productDetails.push({
            id: productId,
            name: product.name,
            price: prices.data[0].unit_amount
          });
        }
      } catch (error) {
        console.error(`❌ Erro ao buscar produto ${productId}:`, error);
      }
    }

    if (totalAmount === 0) {
      return res.status(400).json({ error: 'Nenhum produto válido encontrado' });
    }

    console.log('💰 Total calculado:', totalAmount);

    // Criar o Payment Intent com métodos automáticos
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
      metadata: {
        productIds: productIds.join(','),
        customerName: customerInfo?.name || '',
        customerEmail: customerInfo?.email || '',
        productNames: productDetails.map(p => p.name).join(', ')
      },
      // Usar métodos automáticos - Stripe detecta os disponíveis na conta
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      }
    });

    console.log('✅ Payment Intent criado com sucesso!');
    console.log('- ID:', paymentIntent.id);
    console.log('- Valor:', totalAmount, 'centavos (€' + (totalAmount/100).toFixed(2) + ')');
    console.log('- Cliente:', customerInfo.name, '(' + customerInfo.email + ')');
    console.log('- Produtos:', productDetails.length, 'itens');
    console.log('- Client Secret gerado:', paymentIntent.client_secret ? 'SIM' : 'NÃO');

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      currency: 'eur',
      status: 'success'
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao criar Payment Intent:');
    console.error('- Tipo:', error.type || 'Desconhecido');
    console.error('- Mensagem:', error.message || 'Sem mensagem');
    console.error('- Código:', error.code || 'Sem código');
    console.error('- Request ID:', error.requestId || 'Sem ID');
    
    // Erro específico baseado no tipo
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: `Erro de configuração: ${error.message}`,
        type: 'validation_error'
      });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(401).json({ 
        error: 'Erro de autenticação do Stripe. Verifique as chaves de API.',
        type: 'authentication_error'
      });
    } else {
      return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar Payment Intent',
        type: 'server_error'
      });
    }
  }
});

// Criar sessão de checkout do Stripe para múltiplos produtos (fallback)
router.post('/presents/purchase', async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Forneça uma lista válida de IDs de produtos' });
    }

    console.log('Products IDs recebidos:', productIds);

    // Buscar os produtos da Stripe
    const lineItems = [];
    
    for (const productId of productIds) {
      try {
        const product = await stripe.products.retrieve(productId);
        const prices = await stripe.prices.list({ 
          product: productId, 
          limit: 1,
          active: true 
        });
        
        if (prices.data.length > 0) {
          lineItems.push({
            price: prices.data[0].id,
            quantity: 1,
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar produto ${productId}:`, error);
      }
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ error: 'Nenhum produto válido encontrado' });
    }

    // Criar a sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONT_BASE_URL || 'http://localhost:5173'}/success`,
      cancel_url: `${process.env.FRONT_BASE_URL || 'http://localhost:5173'}/checkout`,
      metadata: {
        productIds: productIds.join(','),
      }
    });

    console.log('Sessão criada:', session.url);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de Checkout:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de Checkout' });
  }
});

// Webhook para lidar com eventos do Stripe
async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  } catch (err) {
    console.error("entrou no erro de constructEvent",)
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const productIds = session.metadata.productIds.split(',');

    // Atualizar o status dos produtos para inativo
    for (const productId of productIds) {
      await stripe.products.update(productId, { active: false });
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const productIds = paymentIntent.metadata.productIds.split(',');

    console.log('✅ Payment Intent succeeded:', paymentIntent.id);
    console.log('🎁 Produtos a marcar como comprados:', productIds);

    // Atualizar o status dos produtos para comprados
    for (const productId of productIds) {
      try {
        await stripe.products.update(productId, { 
          active: false,
          metadata: {
            is_selected: 'true',
            buyer_name: paymentIntent.metadata.customerName || '',
            buyer_email: paymentIntent.metadata.customerEmail || '',
            payment_intent_id: paymentIntent.id
          }
        });
        console.log(`✅ Produto ${productId} marcado como comprado`);
      } catch (error) {
        console.error(`❌ Erro ao atualizar produto ${productId}:`, error);
      }
    }
  }

  res.json({ received: true });
};

module.exports = { router, webhookHandler };