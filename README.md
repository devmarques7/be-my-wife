# Wedding Management System

Sistema completo de gerenciamento de casamento, incluindo lista de presentes, controle de convidados e área administrativa.

## Acesso à Área Administrativa

### URL de Acesso
- **Frontend:** http://localhost:5173
- **Área Administrativa:** http://localhost:5173/login

### Credenciais Padrão
- **Usuário:** admin
- **Senha:** admin123

### Como Acessar
1. Acesse o site principal em http://localhost:5173
2. Role até o final da página
3. Clique no link "Área Administrativa" no rodapé
4. Insira as credenciais de acesso

### Funcionalidades da Área Administrativa
- Visualização de estatísticas dos presentes
  - Total de presentes
  - Presentes selecionados
  - Presentes disponíveis
- Gráfico de distribuição dos presentes
- Botão de logout para encerrar a sessão

## Configuração do Banco de Dados

### Pré-requisitos
- PostgreSQL 14+ instalado
- Node.js 18+ instalado
- Beekeeper Studio (opcional, para gerenciamento do banco de dados)

### Configuração do PostgreSQL
1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados chamado `wedding_management`:
```sql
CREATE DATABASE wedding_management;
```

### Configuração do Beekeeper Studio
1. Instale o Beekeeper Studio
2. Adicione uma nova conexão com as seguintes configurações:
   - Nome: Wedding Management
   - Tipo: PostgreSQL
   - Host: localhost
   - Porta: 5432
   - Usuário: postgres
   - Senha: postgres
   - Banco de dados: wedding_management

### Configuração do Projeto
1. Na pasta `backend`, crie um arquivo `.env` com as seguintes variáveis:
```
DB_NAME=wedding_management
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

2. Execute o script de inicialização do banco de dados:
```bash
cd backend
npm run init-db
```

## Iniciando o Projeto

1. Instale as dependências:
```bash
npm install
cd backend && npm install
```

2. Inicie o servidor backend:
```bash
cd backend
npm run dev
```

3. Em outro terminal, inicie o frontend:
```bash
npm run dev
```

O frontend estará disponível em http://localhost:5173
O backend estará disponível em http://localhost:3001

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `presents`: Armazena informações sobre os presentes
- `gift_selections`: Registra as seleções de presentes pelos convidados
- `admins`: Gerencia os usuários administradores do sistema

## API Endpoints

### Presentes
- GET /api/presents - Listar todos os presentes
- POST /api/presents - Criar um novo presente
- GET /api/presents/:id - Buscar um presente específico
- PUT /api/presents/:id - Atualizar um presente
- DELETE /api/presents/:id - Deletar um presente

### Seleções
- GET /api/selections - Listar todas as seleções
- POST /api/selections - Criar uma nova seleção
- GET /api/selections/:id - Buscar uma seleção específica

### Admin
- POST /api/admin/login - Login do administrador
- GET /api/admin/profile - Perfil do administrador (requer token JWT)

## Solução de Problemas

### Erro de Conexão com o Banco de Dados
Se você receber o erro "password authentication failed for user postgres":
1. Verifique se o PostgreSQL está rodando
2. Confirme se as credenciais no arquivo .env estão corretas
3. Tente conectar usando o Beekeeper Studio para validar as credenciais
4. Reinicie o servidor backend

### Erro de Porta em Uso
Se você receber o erro "EADDRINUSE: address already in use":
1. Execute o comando para matar o processo na porta:
```bash
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```
2. Reinicie o servidor backend

## Segurança
- A área administrativa é protegida por autenticação JWT
- As senhas são armazenadas com hash bcrypt
- O token JWT expira em 1 hora
- Recomenda-se alterar as credenciais padrão após o primeiro acesso

## Suporte
Em caso de problemas ou dúvidas, entre em contato com o administrador do sistema.

