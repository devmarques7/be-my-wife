import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { ICartContext, ICart, ICartItem } from '../types/cart';
import { IPresent } from '../types/presents';

type CartAction = 
  | { type: 'ADD_ITEM'; payload: IPresent }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: ICart, action: CartAction): ICart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const present = action.payload;
      const existingItem = state.items.find(item => item.presentId === present.id);
      
      // Se o item já existe, não adicionar novamente (produtos únicos)
      if (existingItem) {
        return state;
      }

      const newItem: ICartItem = {
        id: `${present.id}-${Date.now()}`,
        presentId: present.id,
        name: present.name,
        description: present.description,
        price: present.price,
        category: present.category,
        image: present.image,
        quantity: 1
      };

      const newItems = [...state.items, newItem];
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      // Para produtos únicos, mantemos sempre quantidade = 1
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: 1 } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Obter função de backup do contexto de sessão (se disponível)
  const getSessionBackup = () => {
    try {
      const saved = localStorage.getItem('bmw_wedding_session_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };
  
  const backupCartToSession = (items: ICartItem[]) => {
    try {
      localStorage.setItem('bmw_wedding_session_cart', JSON.stringify(items));
      console.log('🛒 Carrinho salvo no backup da sessão');
    } catch (error) {
      console.error('❌ Erro ao fazer backup do carrinho:', error);
    }
  };

  // Salvar no localStorage e backup da sessão
  useEffect(() => {
    localStorage.setItem('bmw-cart', JSON.stringify(cart));
    backupCartToSession(cart.items);
  }, [cart]);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const loadCartFromStorage = () => {
      console.log('🛒 Carregando carrinho do localStorage...');
      
      try {
        const savedCart = localStorage.getItem('bmw-cart');
        
        if (!savedCart) {
          console.log('🛒 Nenhum carrinho salvo encontrado');
          return;
        }

        const parsedCart = JSON.parse(savedCart);
        
        if (!parsedCart.items || !Array.isArray(parsedCart.items)) {
          console.log('🛒 Dados do carrinho inválidos');
          localStorage.removeItem('bmw-cart');
          return;
        }

        if (parsedCart.items.length === 0) {
          console.log('🛒 Carrinho vazio');
          return;
        }

        console.log(`🛒 Encontrados ${parsedCart.items.length} itens no carrinho`);

        // Validar e limpar itens
        const validItems = parsedCart.items
          .filter((item: any) => item && item.presentId && item.name && typeof item.price === 'number')
          .map((item: ICartItem) => ({
            ...item,
            quantity: 1 // Garantir quantidade = 1 para produtos únicos
          }));

        if (validItems.length === 0) {
          console.log('🛒 Nenhum item válido encontrado');
          localStorage.removeItem('bmw-cart');
          return;
        }

        console.log(`🛒 ${validItems.length} itens válidos processados`);

        // Recriar o carrinho de forma mais simples
        const newState = {
          items: validItems,
          total: validItems.reduce((sum: number, item: ICartItem) => sum + item.price, 0),
          itemCount: validItems.length
        };

        // Usar dispatch interno para atualizar estado
        validItems.forEach((item: ICartItem) => {
          dispatch({ 
            type: 'ADD_ITEM', 
            payload: {
              id: item.presentId,
              name: item.name,
              description: item.description || '',
              price: item.price,
              category: item.category || 'Outros',
              image: item.image || '',
              isSelected: false,
              buyerName: null,
              buyerEmail: null,
              active: true,
              priceId: item.presentId
            }
          });
        });

        console.log(`✅ Carrinho carregado com sucesso: ${validItems.length} itens, total € ${(newState.total / 100).toFixed(2)}`);

      } catch (error) {
        console.error('❌ Erro ao carregar carrinho:', error);
        localStorage.removeItem('bmw-cart');
        localStorage.removeItem('bmw_wedding_session_cart');
      }
    };

    loadCartFromStorage();
  }, []);

  const addToCart = (present: IPresent): boolean => {
    console.log('🛒 Tentando adicionar produto ao carrinho:', present.name);
    
    const existingItem = cart.items.find(item => item.presentId === present.id);
    if (existingItem) {
      console.log('⚠️ Produto já está no carrinho:', present.name);
      return false; // Produto já está no carrinho
    }

    // Verificar se o produto está disponível
    if (present.isSelected) {
      console.log('❌ Produto não está disponível:', present.name);
      return false;
    }

    dispatch({ type: 'ADD_ITEM', payload: present });
    console.log('✅ Produto adicionado ao carrinho:', present.name, `€${(present.price / 100).toFixed(2)}`);
    return true; // Produto adicionado com sucesso
  };

  const isProductInCart = (productId: string): boolean => {
    return cart.items.some(item => item.presentId === productId);
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value: ICartContext = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    isProductInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 