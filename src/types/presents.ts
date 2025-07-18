export interface IPresent {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  category: string;
  image: string;
  isSelected: boolean;
  buyerName: string | null;
  buyerEmail: string | null;
  active: boolean;
}

// Categorias disponíveis para os presentes
export const PRESENT_CATEGORIES = [
  "Cozinha",
  "Sala",
  "Quarto",
  "Banheiro",
  "Eletrônicos",
  "Decoração",
  "Outros"
] as const;

export type PresentCategory = typeof PRESENT_CATEGORIES[number];

// Interface para criação de presente
export interface CreatePresentInput {
  name: string;
  description: string;
  price: number; // em centavos
  category: PresentCategory;
  image?: string;
}

// Dados mock removidos - produtos vêm diretamente da Stripe 