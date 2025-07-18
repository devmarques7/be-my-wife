# 🧪 Como Testar o Sistema de Pagamento

## ⚡ Quick Start

### 1. Iniciar a Aplicação
```bash
# Terminal 1 - Backend
cd backend-BMW
npm start

# Terminal 2 - Frontend
cd frontend-BMW
npm run dev
```

### 2. Configurar Variável de Ambiente
No arquivo `frontend-BMW/.env` (criar se não existir):
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_51RXU0ZI0TsQHOnFwg28fpk96PaG1UKbufQQtRa69mb69Cd3ViBggHzVYh0vglb6foJ7cWlCKTG5w982qqJUv0Vy100Z3kWamJq
```

## 🔍 Verificação Rápida

### Health Check do Backend
```bash
curl http://localhost:3001/api/stripe/health
```
✅ **Resposta esperada**: `"status": "healthy"`

## 🛒 Teste Completo

### Passo 1: Adicionar Produtos
1. Abra: `http://localhost:5173`
2. Vá para **"Presentes"**
3. Adicione alguns produtos ao carrinho
4. Clique em **"Finalizar Compra"**

### Passo 2: Preencher Dados
1. **Nome**: Digite qualquer nome (ex: "João Silva")
2. **Email**: Digite um email válido (ex: "joao@teste.com")
3. ⏳ **Aguarde**: Sistema cria automaticamente o Payment Intent
4. 💾 **Verificar**: Dados são salvos automaticamente no localStorage

### Passo 2.1: Teste de Persistência (Opcional)
1. **Recarregar página** (F5)
2. ✅ **Verificar**: Nome e email devem aparecer automaticamente
3. **Continuar** com o processo normal

### Passo 3: Escolher Método e Pagar

#### 🎯 Duas Opções Disponíveis

**Opção A - Todos os Métodos (Padrão)**
1. Clique em **"Todos os Métodos de Pagamento"**
2. Selecione **"iDEAL"** no PaymentElement
3. Escolha banco: **"Test Bank"** ou **"ABN AMRO"**
4. Se der erro de email → aparece botão **"Tentar iDEAL Exclusivo"**

**Opção B - iDEAL Exclusivo (Resolução de Problemas)**
1. Clique em **"iDEAL Exclusivo (Holanda)"**
2. Interface simplificada apenas para iDEAL
3. Sem conflitos de validação de email
4. ✅ **Recomendado se tiver problemas com email**

#### 🏦 Fluxo iDEAL
1. Escolha banco: **"ABN AMRO"** (recomendado para teste)
2. Clique **"Pagar com iDEAL"**
3. Redirecionamento para página do banco
4. Selecione **"Success"** na simulação
5. ✅ Retorna automaticamente com confirmação

#### 💳 Teste Cartão
1. Selecione **"Card"** no formulário
2. **Número**: `4242424242424242`
3. **Data**: Qualquer data futura (ex: 12/25)
4. **CVC**: Qualquer 3 dígitos (ex: 123)
5. **CEP**: Qualquer (ex: 12345)
6. Clique em **"Finalizar Pagamento"**
7. ✅ Pagamento processado instantaneamente

## 📱 Dados de Teste

### Cartões que Funcionam
| Número | Resultado |
|--------|-----------|
| `4242424242424242` | ✅ Sucesso |
| `4000000000000002` | ❌ Falha (Cartão recusado) |
| `4000000000003220` | 🔐 Requer 3D Secure |

### Bancos iDEAL (Teste)
- **ABN AMRO** → Simula banco real
- **Test Bank** → Para testes rápidos
- **ING Bank** → Outro banco holandês

## 🔍 Verificação de Sucesso

### ✅ Indicadores que Está Funcionando

1. **Console do Browser**:
   ```javascript
   💾 Informações do cliente salvas: {name: "Daniel", email: "daniel@gmail.com"}
   💳 Informações do cliente para pagamento: {name: "Daniel", email: "daniel@gmail.com"}
   💳 Email validado: true
   💳 Billing details finais: {name: "Daniel Marques", email: "daniel@gmail.com"}
   💳 ConfirmParams configurados: {return_url: "...", payment_method_data: {...}}
   ✅ Payment Intent criado: pi_xxx
   ✅ Pagamento processado com sucesso!
   ```

2. **Console do Backend**:
   ```bash
   ✅ Payment Intent criado com sucesso!
   - ID: pi_xxx
   - Valor: 2000 centavos (€20.00)
   ✅ Payment Intent succeeded: pi_xxx
   ```

3. **Interface**:
   - Dados do cliente salvos automaticamente
   - PaymentElement aparece após preencher dados
   - iDEAL aparece como primeira opção
   - Redirecionamento funciona (para iDEAL)
   - Página de sucesso é exibida

4. **LocalStorage (F12 > Application > Local Storage)**:
   ```javascript
   bmw_wedding_session: {customerInfo: {name: "João", email: "joao@teste.com"}}
   bmw_wedding_session_cart: [{id: "...", name: "Produto", price: 2000}]
   bmw-cart: {items: [...], total: 2000, itemCount: 1}
   ```

## ❌ Troubleshooting

### Erro "email_invalid" (Resolvido)
```javascript
// ✅ SOLUÇÃO AUTOMÁTICA: Fallback implementado
1. Sistema tenta primeiro com billing_details
2. Se falhar, tenta automaticamente sem billing_details
3. Logs detalhados mostram o processo
```

### Erro "billing_details" (Novo - Resolvido)
```javascript
// ✅ CORREÇÃO: Configuração inteligente
1. PaymentElement configurado condicionalmente
2. billing_details passados quando necessário
3. Validação rigorosa de nome (>= 2 chars) e email
```

### PaymentElement não aparece
```bash
# Verificar se a chave está correta
echo $VITE_STRIPE_PUBLIC_KEY
# Deve começar com: pk_test_
```

### Erro 500 no backend
```bash
# Verificar se backend tem chave secreta
# No arquivo backend-BMW/.env:
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
```

### iDEAL não redireciona
- ✅ **Normal**: iDEAL sempre redireciona para o banco
- ✅ **Teste**: Use "ABN AMRO" + "Success"
- ❌ **Problema**: Se não redireciona, verificar console de erros
- 🔧 **Solução**: Tente "iDEAL Exclusivo" se tiver problemas

### Fallback Automático Não Funciona
```javascript
// Se o método padrão falhar:
1. Aparece aviso: "Problemas com email? Experimente a opção iDEAL exclusiva"
2. Clique no botão "Tentar iDEAL Exclusivo"
3. Usa configuração simplificada
```

## 🎯 Métodos Disponíveis

A aplicação suporta automaticamente:

- 🏦 **iDEAL** (Holanda) - *Prioridade 1*
- 💳 **Cartão** (Global) - *Prioridade 2*
- 🟦 **PayPal** (Global)
- 🛍️ **Klarna** (Europa - Buy now, pay later)
- 🇧🇪 **Bancontact** (Bélgica)
- 🇦🇹 **EPS** (Áustria)
- 🇩🇪 **Giropay** (Alemanha)
- 🌍 **SOFORT** (Europa)

## 📞 Suporte

Se algo não funcionar:

1. **Verificar console** do browser (F12)
2. **Verificar logs** do backend
3. **Testar health check**: `curl http://localhost:3001/api/stripe/health`
4. **Reiniciar serviços** se necessário

---

**🎉 Pronto para testar!** A implementação está completamente funcional com foco em iDEAL + cartão. 