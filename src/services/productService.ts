import { loadStripe } from '@stripe/stripe-js';
import api from './api';
import { IPresent } from '../types/presents';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CreatePresentInput {
  name: string;
  description: string;
  price: number; // em centavos
  category: string;
  image?: string;
}

// Cache para produtos
const PRODUCTS_CACHE_KEY = 'bmw_products_cache';
const PRODUCTS_SKELETON_KEY = 'bmw_products_skeleton';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos (aumentado)
const SKELETON_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas para skeleton

interface CachedProducts {
  data: IPresent[];
  timestamp: number;
  version: string;
}

interface ProductSkeleton {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface SkeletonCache {
  data: ProductSkeleton[];
  timestamp: number;
}

export const productService = {
  // Cache local para melhorar performance
  _productsCache: null as CachedProducts | null,
  _skeletonCache: null as SkeletonCache | null,

  // Verificar se o cache é válido
  _isCacheValid(): boolean {
    if (!this._productsCache) return false;
    const now = Date.now();
    return (now - this._productsCache.timestamp) < CACHE_DURATION;
  },

  // Verificar se o skeleton cache é válido
  _isSkeletonCacheValid(): boolean {
    if (!this._skeletonCache) return false;
    const now = Date.now();
    return (now - this._skeletonCache.timestamp) < SKELETON_CACHE_DURATION;
  },

  // Salvar no cache
  _saveToCache(data: IPresent[]): void {
    this._productsCache = {
      data,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    // Salvar também no localStorage
    try {
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(this._productsCache));
    } catch (error) {
      console.warn('Failed to save products to localStorage:', error);
    }

    // Salvar skeleton para carregamento rápido futuro
    this._saveSkeletonToCache(data);
  },

  // Salvar skeleton cache
  _saveSkeletonToCache(data: IPresent[]): void {
    const skeletonData = data.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price
    }));

    this._skeletonCache = {
      data: skeletonData,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(PRODUCTS_SKELETON_KEY, JSON.stringify(this._skeletonCache));
    } catch (error) {
      console.warn('Failed to save skeleton to localStorage:', error);
    }
  },

  // Carregar skeleton do cache
  _loadSkeletonFromCache(): ProductSkeleton[] | null {
    // Tentar cache em memória primeiro
    if (this._isSkeletonCacheValid()) {
      return this._skeletonCache!.data;
    }

    // Tentar localStorage
    try {
      const cached = localStorage.getItem(PRODUCTS_SKELETON_KEY);
      if (cached) {
        const parsedCache: SkeletonCache = JSON.parse(cached);
        const now = Date.now();
        
        if ((now - parsedCache.timestamp) < SKELETON_CACHE_DURATION) {
          this._skeletonCache = parsedCache;
          return parsedCache.data;
        } else {
          localStorage.removeItem(PRODUCTS_SKELETON_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load skeleton from cache:', error);
      localStorage.removeItem(PRODUCTS_SKELETON_KEY);
    }

    return null;
  },

  // Carregar do cache
  _loadFromCache(): IPresent[] | null {
    // Tentar cache em memória primeiro
    if (this._isCacheValid()) {
      console.log('📦 Produtos carregados do cache em memória');
      return this._productsCache!.data;
    }

    // Tentar localStorage
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (cached) {
        const parsedCache: CachedProducts = JSON.parse(cached);
        const now = Date.now();
        
        if ((now - parsedCache.timestamp) < CACHE_DURATION) {
          this._productsCache = parsedCache;
          console.log('💾 Produtos carregados do localStorage cache');
          return parsedCache.data;
        } else {
          localStorage.removeItem(PRODUCTS_CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
    }

    return null;
  },

  // Carregar skeleton - para exibição imediata
  getSkeletonData(): ProductSkeleton[] | null {
    return this._loadSkeletonFromCache();
  },

  // Listar todos os produtos da Stripe com cache
  async listProducts(): Promise<IPresent[]> {
    console.log('🔄 Carregando produtos...');
    
    // Tentar cache primeiro
    const cachedData = this._loadFromCache();
    if (cachedData) {
      return cachedData;
    }

    console.log('🌐 Buscando produtos da API...');
    const maxRetries = 3;
    const baseDelay = 500; // Reduzido para 500ms

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await api.get('/api/stripe/presents');
        const products = response.data;
        
        // Salvar no cache
        this._saveToCache(products);
        console.log(`✅ ${products.length} produtos carregados da API`);
        
        return products;
      } catch (error: any) {
        const isRateLimit = error.response?.data?.error?.includes('rate limit');
        const isLastAttempt = attempt === maxRetries - 1;

        if (isRateLimit && !isLastAttempt) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`⏳ Rate limit detectado, aguardando ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        console.error(`❌ Erro no carregamento (tentativa ${attempt + 1}):`, error);
        
        if (isLastAttempt) {
          throw error;
        }
      }
    }

    throw new Error('Failed to fetch products after multiple attempts');
  },

  // Forçar reload dos produtos
  async forceReload(): Promise<IPresent[]> {
    // Limpar cache
    this._productsCache = null;
    localStorage.removeItem(PRODUCTS_CACHE_KEY);
    
    console.log('🔄 Forçando reload dos produtos...');
    return this.listProducts();
  },

  // Obter um produto específico da Stripe
  async getProduct(productId: string): Promise<IPresent> {
    try {
      const response = await api.get(`/api/stripe/presents/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Registrar compra de um presente
  async purchasePresent(productId: string, buyerName: string, buyerEmail: string): Promise<IPresent> {
    try {
      const response = await api.post(`/api/presents/${productId}/purchase`, {
        buyerName,
        buyerEmail
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  },

  // Criar um novo presente
  async createPresent(presentData: CreatePresentInput): Promise<IPresent> {
    try {
      // Converter preço para centavos
      const dataInCents = {
        ...presentData,
        price: Math.round(presentData.price * 100)
      };
      
      const response = await api.post('/api/presents', dataInCents);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Criar múltiplos presentes
  async createBatchPresents(presents: CreatePresentInput[]): Promise<IPresent[]> {
    try {
      // Converter preços para centavos
      const productsInCents = presents.map(present => ({
        ...present,
        price: Math.round(present.price * 100)
      }));

      const response = await api.post('/api/presents/batch', {
        products: productsInCents
      });
      return response.data;
    } catch (error) {
      console.error('Error creating batch products:', error);
      throw error;
    }
  },

  // Iniciar checkout do Stripe
  async initiateCheckout(productId: string): Promise<string> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const response = await api.post(`/api/checkout/session`, { productId });
      const { sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) throw error;
      return sessionId;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      throw error;
    }
  },

    // Criar Payment Intent para Stripe Elements
  async createPaymentIntent(productIds: string[], customerInfo: { name: string; email: string }): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      console.log('💳 ProductService: Criando Payment Intent');
      console.log('💳 Product IDs:', productIds);
      console.log('💳 Customer Info:', customerInfo);
      
      const response = await api.post('/api/stripe/presents/create-payment-intent', { 
        productIds,
        customerInfo
      });
      
      console.log('💳 Payment Intent criado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar Payment Intent:', error);
      throw error;
    }
  },

  // Iniciar checkout do Stripe (fallback)
  async presentPurchase(productIds: string[]): Promise<string> {
    try {
      console.log('🌐 ProductService: Iniciando chamada para purchase');
      console.log('🌐 ProductService: URL:', '/api/stripe/presents/purchase');
      console.log('🌐 ProductService: Product IDs:', productIds);
      
      const response = await api.post(`/api/stripe/presents/purchase`, { productIds });
      
      console.log('🌐 ProductService: Response status:', response.status);
      console.log('🌐 ProductService: Response data:', response.data);
      
      const { url } = response.data;
      
      if (!url) {
        throw new Error('URL não encontrada na resposta do servidor');
      }
      
      console.log('🌐 ProductService: URL extraída:', url);
      return url;
    } catch (error: any) {
      console.error('🌐 ProductService: ERRO DETALHADO:');
      console.error('🌐 ProductService: - Tipo:', typeof error);
      console.error('🌐 ProductService: - Mensagem:', error?.message);
      console.error('🌐 ProductService: - Response Data:', error?.response?.data);
      console.error('🌐 ProductService: - Status:', error?.response?.status);
      console.error('🌐 ProductService: - URL:', error?.config?.url);
      console.error('🌐 ProductService: - Method:', error?.config?.method);
      console.error('🌐 ProductService: - Request Data:', error?.config?.data);
      console.error('🌐 ProductService: - Erro completo:', error);
      throw error;
    }
  }
}; 