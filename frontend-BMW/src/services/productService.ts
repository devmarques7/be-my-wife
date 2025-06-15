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

export const productService = {
  // Listar todos os produtos
  async listProducts(): Promise<IPresent[]> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await api.get('/api/presents');
        return response.data;
      } catch (error: any) {
        const isRateLimit = error.response?.data?.error?.includes('rate limit');
        const isLastAttempt = attempt === maxRetries - 1;

        if (isRateLimit && !isLastAttempt) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        console.error('Error fetching products:', error);
        throw error;
      }
    }

    throw new Error('Failed to fetch products after multiple attempts');
  },

  // Obter um produto específico
  async getProduct(productId: string): Promise<IPresent> {
    try {
      const response = await api.get(`/api/presents/${productId}`);
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
  }
}; 