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

export const MOCK_PRESENTS: IPresent[] = [
  {
    id: "1",
    name: "Jogo de Panelas Premium",
    description: "Conjunto de 5 panelas antiaderentes com revestimento cerâmico",
    price: 899.90,
    priceId: "1",
    category: "Cozinha",
    image: "/source/presents/pan.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  },
  {
    id: "2",
    name: "Cama King Size",
    description: "Cama king size com cabeceira estofada e estrutura em madeira",
    price: 2499.90,
    priceId: "2",
    category: "Quarto",
    image: "/source/presents/bed.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  },
  {
    id: "3",
    name: "Sofá 3 Lugares",
    description: "Sofá retrátil com 3 lugares em tecido premium",
    price: 1999.90,
    priceId: "3",
    category: "Sala",
    image: "/source/presents/sofa.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  },
  {
    id: "4",
    name: "Jogo de Toalhas",
    description: "Conjunto com 6 toalhas de banho em algodão egípcio",
    price: 299.90,
    priceId: "4",
    category: "Banheiro",
    image: "/source/presents/towels.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  },
  {
    id: "5",
    name: "Mesa de Jantar",
    description: "Mesa de jantar para 6 pessoas em madeira maciça",
    price: 1599.90,
    priceId: "5",
    category: "Sala",
    image: "/source/presents/table.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  },
  {
    id: "6",
    name: "Luminária de Mesa",
    description: "Luminária de mesa com design moderno e regulagem de intensidade",
    price: 199.90,
    priceId: "6",
    category: "Decoração",
    image: "/source/presents/lamp.jpg",
    isSelected: false,
    buyerName: null,
    buyerEmail: null,
    active: true
  }
]; 