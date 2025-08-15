export interface ICartItem {
  id: string;
  presentId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
  itemCount: number;
}

export interface ICheckoutForm {
  name: string;
  email: string;
  paymentMethod: 'card' | 'pix' | 'transfer';
}

export interface ICartContext {
  cart: ICart;
  addToCart: (present: any) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  isProductInCart: (productId: string) => boolean;
} 