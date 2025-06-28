import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Divider,
  List,
  ListItem,
  Avatar,
  Stack,
  Button,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { AppContext } from '../context/AppContext';
import AppButton from '../components/AppButton/AppButton';
import ProductSuggestions from '../components/ProductSuggestions/ProductSuggestions';
import CompactCountDown from '../components/CountDown/CompactCountDown';
import PaymentMethodSelector from '../components/PaymentMethodSelector/PaymentMethodSelector';
import { ICheckoutForm } from '../types/cart';
import { productService } from '../services/productService';

const CheckoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { customerInfo, setCustomerInfo } = useSession();
  const { webContent } = useContext(AppContext);

  const [formData, setFormData] = useState<ICheckoutForm>({
    name: customerInfo.name || '',
    email: customerInfo.email || '',
    paymentMethod: 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');

  // Sincronizar formData com customerInfo do SessionContext
  useEffect(() => {
    if (customerInfo.name || customerInfo.email) {
      setFormData(prev => ({
        ...prev,
        name: customerInfo.name || prev.name,
        email: customerInfo.email || prev.email
      }));
    }
  }, [customerInfo]);

  // Detectar retorno de pagamento via URL (para compatibilidade com checkout sessions)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      console.log('✅ Retorno detectado do Stripe com sucesso');
      handleStripeSuccess();
      
      // Limpar parâmetros da URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleInputChange = (field: keyof ICheckoutForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));

    // Atualizar SessionContext quando nome ou email mudarem
    if (field === 'name' || field === 'email') {
      const updatedCustomerInfo = {
        name: field === 'name' ? newValue : formData.name,
        email: field === 'email' ? newValue : formData.email
      };
      setCustomerInfo(updatedCustomerInfo);
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    console.log('🚀 Iniciando processo de checkout...');
    console.log('📋 Dados do formulário:', formData);
    console.log('🛒 Itens no carrinho:', cart.items);
    
    if (!validateForm()) {
      console.error('❌ Validação do formulário falhou');
      return;
    }

    // Se o Payment Intent já foi criado, não criar novamente
    if (clientSecret) {
      console.log('💳 Payment Intent já existe, aguardando pagamento...');
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const presentIds = cart.items.map(item => item.presentId);
      console.log('🎁 IDs dos presentes a comprar:', presentIds);
      
      if (presentIds.length === 0) {
        console.error('❌ Nenhum presente no carrinho');
        setIsSubmitting(false);
        return;
      }

      console.log('💳 Criando Payment Intent...');
      const paymentData = await productService.createPaymentIntent(presentIds, {
        name: formData.name,
        email: formData.email
      });
      
      console.log('✅ Payment Intent criado:', paymentData);

      // Configurar dados do Payment Intent para exibir inline
      setClientSecret(paymentData.clientSecret);
      setPaymentIntentId(paymentData.paymentIntentId);
      console.log('✅ Formulário de pagamento ativado');

    } catch (error: any) {
      console.error('❌ ERRO DETALHADO no processamento do pedido:');
      console.error('- Tipo do erro:', typeof error);
      console.error('- Mensagem:', error?.message);
      console.error('- Response:', error?.response?.data);
      console.error('- Status:', error?.response?.status);
      
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro desconhecido';
      setPaymentError(errorMessage);
      
      // Mostrar erro específico baseado no tipo
      if (error?.response?.status === 400) {
        alert(`Erro de validação: ${errorMessage}`);
      } else if (error?.response?.status === 401) {
        alert('Erro de autenticação. Verifique as configurações do Stripe.');
      } else {
        alert(`Erro ao processar pagamento: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Processo de checkout finalizado');
    }
  };

  // Função otimizada para criar Payment Intent automaticamente
  const createPaymentIntentIfReady = useCallback(async () => {
    if (formData.name && formData.email && !clientSecret && !isSubmitting && validateForm()) {
      console.log('🔄 Criando Payment Intent automaticamente...');
      await handleSubmit();
    }
  }, [formData.name, formData.email, clientSecret, isSubmitting]);

  useEffect(() => {
    const timer = setTimeout(createPaymentIntentIfReady, 1000);
    return () => clearTimeout(timer);
  }, [createPaymentIntentIfReady]);

  const handleStripeSuccess = () => {
    clearCart();
    setSubmitted(true);
    // Limpar dados do payment intent
    setClientSecret('');
    setPaymentIntentId('');
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Erro no pagamento:', error);
    setPaymentError(error);
  };

  if (cart.items.length === 0 && !submitted) {
    return (
      <Container id="checkout_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
        <Header />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3
        }}>
          <Typography variant="h5" gutterBottom>
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Adicione alguns presentes antes de finalizar a compra
          </Typography>
          <AppButton
            text="Ver Presentes"
            type="primary"
            navigateTo="/presents"
          />
        </Box>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container id="checkout_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
        <Header />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 3
        }}>
          <Alert severity="success" sx={{ mb: 3, maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Pedido realizado com sucesso! 🎉
            </Typography>
            <Typography variant="body2">
              Você receberá um email de confirmação em breve.
              Obrigado pelo seu presente!
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

  const { DATETIME_COUNTDOWN, TIME_FIELDS } = webContent?.COUNTDOWN || {};

  return (
    <>
      <Container id="checkout_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
        <Header />
        
        {/* Countdown Section */}
        {DATETIME_COUNTDOWN && TIME_FIELDS && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            py: { xs: 2, md: 3 },
            px: { xs: 2, md: 4 }
          }}>
            <CompactCountDown 
              datetime={DATETIME_COUNTDOWN} 
              time_fields={TIME_FIELDS}
            />
          </Box>
        )}
        
        <Box sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: 'calc(100vh - 200px)' // Garante scroll completo
        }}>
          {/* Header da página */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={2} 
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/presents')}
              sx={{ 
                color: theme.palette.text.primary,
                mb: { xs: 1, sm: 0 }
              }}
            >
              Voltar
            </Button>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2.125rem' }
              }}
            >
              Finalizar Compra
            </Typography>
          </Stack>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* Formulário */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: { xs: 2, md: 3 },
                borderRadius: 2,
                boxShadow: 3
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Informações para Agradecimento
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '0.875rem', sm: '0.9rem' }
                  }}
                >
                  Precisamos apenas do seu nome e email para enviarmos um agradecimento especial.
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        size="medium"
                        sx={{ mb: { xs: 1, sm: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        size="medium"
                      />
                    </Grid>
                  </Grid>
                </form>
              </Paper>

              {/* Método de Pagamento Integrado */}
              <Paper sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                boxShadow: 3
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Método de Pagamento
                </Typography>
                
                {/* Informações sobre Stripe */}
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    alignItems={{ xs: 'flex-start', sm: 'center' }} 
                    spacing={1}
                  >
                    <SecurityIcon sx={{ mb: { xs: 1, sm: 0 } }} />
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '0.9rem' }
                        }}
                      >
                        Pagamento Seguro via Stripe
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Seus dados são processados de forma segura. Suporte a cartão, iDEAL, PayPal e outros métodos.
                      </Typography>
                    </Box>
                  </Stack>
                </Alert>

                {/* Seletor de Métodos de Pagamento */}
                {clientSecret ? (
                  <PaymentMethodSelector
                    clientSecret={clientSecret}
                    onSuccess={handleStripeSuccess}
                    onError={handlePaymentError}
                    customerInfo={{
                      name: formData.name.trim(),
                      email: formData.email.trim().toLowerCase()
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Complete as informações acima para prosseguir com o pagamento
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Resumo do Pedido */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ 
                p: { xs: 2, sm: 3 }, 
                position: { lg: 'sticky' }, 
                top: 20,
                borderRadius: 2,
                boxShadow: 3,
                mt: { xs: 2, lg: 0 }
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Resumo do Pedido
                </Typography>

                <List sx={{ p: 0, maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ px: 0, py: { xs: 1.5, sm: 1 } }}>
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          variant="rounded"
                          sx={{ 
                            width: { xs: 45, sm: 50 }, 
                            height: { xs: 45, sm: 50 }, 
                            mr: { xs: 1.5, sm: 2 }
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            Produto único
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                          >
                            € {(item.price / 100).toFixed(2)}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < cart.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: { xs: 1.5, sm: 2 },
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="h6"
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    Total:
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    € {(cart.total / 100).toFixed(2)}
                  </Typography>
                </Box>

                <AppButton
                  text={clientSecret ? 'Complete o Pagamento Abaixo' : (isSubmitting ? 'Preparando...' : 'Preencha os Dados')}
                  type={clientSecret ? 'dashed' : 'primary'}
                  onClick={() => {
                    if (!clientSecret) {
                      handleSubmit();
                    }
                  }}
                  disabled={isSubmitting || !!clientSecret}
                  fullWidth={true}
                />

              </Paper>
            </Grid>
          </Grid>

          {/* Mensagem de Erro de Pagamento */}
          {paymentError && (
            <Alert severity="error" sx={{ mb: 4 }}>
              <Typography variant="body2">
                {paymentError}
              </Typography>
            </Alert>
          )}

          {/* Sugestões de Produtos */}
          <ProductSuggestions
            excludeIds={cart.items.map(item => item.presentId)}
            maxItems={4}
          />
        </Box>
      </Container>


    </>
  );
};

export default CheckoutPage; 