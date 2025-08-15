# Configuração de Variáveis de Ambiente

## Frontend (Vite)

Crie um arquivo `.env` na raiz do projeto com:

```
VITE_API_URL=http://localhost:3001
```

Para produção, altere para a URL do seu backend em produção:

```
VITE_API_URL=https://api.seudominio.com
```

## Backend (Monitor)

Para o arquivo `monitor.js`, defina a variável de ambiente:

```bash
export API_URL=http://localhost:3001
```

Ou crie um arquivo `.env` com:

```
API_URL=http://localhost:3001
```

## Alterações Implementadas

Todas as URLs hardcoded para `http://localhost:3001` foram substituídas por variáveis de ambiente:

- `src/services/api.ts` - Agora usa `API_CONFIG.baseURL`
- `src/pages/LoginPage.tsx` - Agora usa `API_CONFIG.baseURL + API_CONFIG.endpoints.login`
- `src/pages/AdminPage.tsx` - Agora usa `API_CONFIG.baseURL + API_CONFIG.endpoints.statistics`
- `monitor.js` - Agora usa `process.env.API_URL`

## Arquivo de Configuração

Foi criado `src/config/api.config.ts` que centraliza todas as configurações da API e usa as variáveis de ambiente do Vite. 