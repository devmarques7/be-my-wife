# Backend BMW

Este é o backend do sistema de presentes de casamento integrado com Stripe.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## Características do Sistema

1. Todos os produtos são gerenciados via Stripe
2. As categorias são salvas como metadata no Stripe
3. O status de seleção (compra) é salvo como metadata no Stripe
4. As informações do comprador são salvas como metadata no Stripe
5. Não é necessário banco de dados local, todos os dados são gerenciados pelo Stripe

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm run dev
```

## Rotas da API

Todas as rotas retornam os produtos formatados no seguinte padrão:
```typescript
interface Present {
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
```

### Listar Presentes
```http
GET /api/presents
```
Retorna todos os presentes cadastrados.

### Buscar Presente Específico
```http
GET /api/presents/:id
```
Retorna um presente específico pelo ID.

### Criar Presente
```http
POST /api/presents
```
Cria um novo presente.

Body:
```json
{
  "name": "Nome do Presente",
  "description": "Descrição detalhada",
  "price": 10000, // valor em centavos (R$ 100,00)
  "category": "Categoria",
  "image": "URL da imagem" // opcional
}
```

### Criar Múltiplos Presentes
```http
POST /api/presents/batch
```
Cria vários presentes de uma vez.

Body:
```json
{
  "products": [
    {
      "name": "Presente 1",
      "description": "Descrição 1",
      "price": 10000,
      "category": "Categoria 1",
      "image": "URL 1"
    },
    {
      "name": "Presente 2",
      "description": "Descrição 2",
      "price": 20000,
      "category": "Categoria 2",
      "image": "URL 2"
    }
  ]
}
```

### Atualizar Presente
```http
PUT /api/presents/:id
```
Atualiza um presente existente.

Body:
```json
{
  "name": "Novo Nome",
  "description": "Nova Descrição",
  "price": 15000, // opcional
  "category": "Nova Categoria",
  "image": "Nova URL",
  "active": true
}
```

### Registrar Compra
```http
POST /api/presents/:id/purchase
```
Registra a compra/seleção de um presente.

Body:
```json
{
  "buyerName": "Nome do Comprador",
  "buyerEmail": "email@comprador.com"
}
```

### Listar Presentes Comprados
```http
GET /api/presents/purchased
```
Retorna a lista de presentes já comprados/selecionados.

## Exemplos de Uso (Frontend)

### Listando Presentes
```typescript
const fetchPresents = async () => {
  const response = await fetch('http://localhost:3001/api/presents');
  const presents = await response.json();
  return presents;
};
```

### Criando um Presente
```typescript
const createPresent = async (presentData) => {
  const response = await fetch('http://localhost:3001/api/presents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(presentData),
  });
  return await response.json();
};
```

### Criando Múltiplos Presentes
```typescript
const createBatchPresents = async (products) => {
  const response = await fetch('http://localhost:3001/api/presents/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ products }),
  });
  return await response.json();
};

// Exemplo de uso:
const products = [
  {
    name: "Jogo de Panelas",
    category: "Cozinha",
    price: 89900, // R$ 899,00
    description: "Conjunto de panelas antiaderentes com 10 peças"
  },
  {
    name: "Liquidificador",
    category: "Eletrodomésticos",
    price: 29900, // R$ 299,00
    description: "Liquidificador 1000W com 5 velocidades"
  }
];

const result = await createBatchPresents(products);
```

### Registrando uma Compra
```typescript
const purchasePresent = async (presentId, buyerData) => {
  const response = await fetch(`http://localhost:3001/api/presents/${presentId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buyerData),
  });
  return await response.json();
};
```

## Observações Importantes

1. Todos os preços devem ser enviados em centavos (ex: R$ 100,00 = 10000)
2. As categorias são salvas como metadata no Stripe
3. O status de seleção (compra) é salvo como metadata no Stripe
4. As informações do comprador são salvas como metadata no Stripe
5. Não é necessário banco de dados local, todos os dados são gerenciados pelo Stripe

## Tratamento de Erros

O sistema retorna erros com o seguinte formato:
```json
{
  "error": "Mensagem descritiva do erro"
}
```

Códigos de status HTTP:
- 200: Sucesso
- 201: Criado com sucesso
- 400: Erro de validação
- 404: Recurso não encontrado
- 500: Erro interno do servidor 