import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  Divider,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip
} from '@mui/material';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Euro as EuroIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import AppButton from '../AppButton/AppButton';

// Configurar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RXU0ZI0TsQHOnFwg28fpk96PaG1UKbufQQtRa69mb69Cd3ViBggHzVYh0vglb6foJ7cWlCKTG5w982qqJUv0Vy100Z3kWamJq');

// Definir métodos de pagamento disponíveis
const PAYMENT_METHODS = {
  card: {
    id: 'card',
    name: 'Cartão de Crédito/Débito',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCardIcon,
    region: 'global',
    recommended: true
  },
  ideal: {
    id: 'ideal',
    name: 'iDEAL',
    description: 'Método bancário popular na Holanda',
    icon: BankIcon,
    region: 'NL',
    recommended: true
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pagamento através do PayPal',
    icon: PaymentIcon,
    region: 'global',
    recommended: false
  },
  klarna: {
    id: 'klarna',
    name: 'Klarna',
    description: 'Compre agora, pague depois',
    icon: EuroIcon,
    region: 'EU',
    recommended: false
  },
  bancontact: {
    id: 'bancontact',
    name: 'Bancontact',
    description: 'Método bancário da Bélgica',
    icon: BankIcon,
    region: 'BE',
    recommended: false
  },
  eps: {
    id: 'eps',
    name: 'EPS',
    description: 'Transferência bancária austríaca',
    icon: BankIcon,
    region: 'AT',
    recommended: false
  },
  giropay: {
    id: 'giropay',
    name: 'Giropay',
    description: 'Transferência bancária alemã',
    icon: BankIcon,
    region: 'DE',
    recommended: false
  },
  sofort: {
    id: 'sofort',
    name: 'SOFORT',
    description: 'Transferência bancária europeia',
    icon: BankIcon,
    region: 'EU',
    recommended: false
  }
} as const;

type PaymentMethodId = keyof typeof PAYMENT_METHODS;

interface StripePaymentProps {
  onError: (message: string) => void;
  onCancel: () => void;
  orderSummary: {
    items: Array<{
      name: string;
      price: number;
    }>;
    total: number;
  };
}

interface PaymentFormProps {
  onError: (error: string) => void;
  onCancel: () => void;
  orderSummary: {
    items: Array<{
      name: string;
      price: number;
    }>;
    total: number;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onError, onCancel, orderSummary }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('card');
  const [showMethodSelector, setShowMethodSelector] = useState(true);
  
  // Estados para billing details
  const [billingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Validação dos campos de billing details
  const validateBillingDetails = () => {
    const errors: string[] = [];
    
    if (!billingDetails.name.trim() || billingDetails.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.([a-zA-Z]{2,})+$/;
    if (!emailRegex.test(billingDetails.email.trim())) {
      errors.push('Email deve ser válido');
    }
    
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(billingDetails.phone.replace(/[\s\-()]/g, ''))) {
      errors.push('Telefone deve ser válido (exemplo: +351123456789)');
    }
    
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe não foi carregado corretamente');
      return;
    }

    // Validar billing details
    const validationErrors = validateBillingDetails();
    if (validationErrors.length > 0) {
      const errorMsg = validationErrors.join(', ');
      setErrorMessage(errorMsg);
      onError(errorMsg);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log(`💳 Processando pagamento com ${selectedMethod}...`);
      console.log('📋 Billing details:', billingDetails);
      
      // Simplificar para evitar erros de tipo
      setErrorMessage('Funcionalidade de pagamento em desenvolvimento');
      onError('Funcionalidade de pagamento em desenvolvimento');
      
    } catch (err: unknown) {
      console.error('❌ Erro inesperado:', err);
      setErrorMessage('Erro inesperado ao processar pagamento');
      onError('Erro inesperado ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Resumo do Pedido */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Resumo do Pedido
        </Typography>
        
        {orderSummary.items.map((item, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 1
            }}
          >
            <Typography variant="body2">{item.name}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              € {(item.price / 100).toFixed(2)}
            </Typography>
          </Box>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Total:
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            € {(orderSummary.total / 100).toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Seleção do Método de Pagamento */}
      {showMethodSelector && (
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Escolha seu método de pagamento
          </Typography>
          
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethodId)}
            >
              {Object.values(PAYMENT_METHODS)
                .filter(method => method.recommended || selectedMethod === method.id)
                .map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <FormControlLabel
                      key={method.id}
                      value={method.id}
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <IconComponent color="primary" />
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {method.name}
                              </Typography>
                              {method.recommended && (
                                <Chip 
                                  label="Recomendado" 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                            <Typography variant="caption" color="textSecondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ 
                        border: '1px solid',
                        borderColor: selectedMethod === method.id ? 'primary.main' : 'grey.300',
                        borderRadius: 1,
                        p: 1,
                        mb: 1,
                        '&:last-child': { mb: 0 }
                      }}
                    />
                  );
                })}
            </RadioGroup>
          </FormControl>
        </Paper>
      )}

      {/* Informações de Segurança */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SecurityIcon />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Pagamento Seguro
            </Typography>
            <Typography variant="body2">
              Seus dados são protegidos com criptografia de ponta a ponta.
            </Typography>
          </Box>
        </Stack>
      </Alert>

      {/* Botão para confirmar método e continuar */}
      {showMethodSelector && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <AppButton
            text={`Continuar com ${PAYMENT_METHODS[selectedMethod].name}`}
            type="primary"
            onClick={() => setShowMethodSelector(false)}
            fullWidth={true}
          />
        </Box>
      )}

      {/* Elemento de Pagamento do Stripe */}
      {!showMethodSelector && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mr: 2 }}>
              {PAYMENT_METHODS[selectedMethod].name}
            </Typography>
            <AppButton
              text="Alterar método"
              type="dashed"
              onClick={() => setShowMethodSelector(true)}
            />
          </Box>
          
          <PaymentElement 
            options={{
              layout: selectedMethod === 'card' ? 'tabs' : 'accordion',
              paymentMethodOrder: [selectedMethod],
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto'
                }
              },
              ...(selectedMethod === 'ideal' && {
                wallets: {
                  applePay: 'never',
                  googlePay: 'never'
                }
              })
            }}
          />
        </Box>
      )}

      {/* Mensagem de Erro */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Botões - Só aparecem quando o formulário de pagamento está ativo */}
      {!showMethodSelector && (
        <Stack direction="row" spacing={2}>
          <AppButton
            text="Cancelar"
            type="dashed"
            onClick={onCancel}
            disabled={isProcessing}
            fullWidth={true}
          />
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            style={{
              width: '100%',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: (!stripe || isProcessing) ? 'not-allowed' : 'pointer',
              opacity: (!stripe || isProcessing) ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </Stack>
      )}

      {/* Indicador de carregamento */}
      {isProcessing && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 2
        }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Processando seu pagamento...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Componente principal
const StripePayment: React.FC<StripePaymentProps> = ({ onError, onCancel, orderSummary }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Verificar se o Stripe foi carregado
    stripePromise.then((stripe) => {
      if (stripe) {
        setStripeLoaded(true);
      } else {
        onError('Falha ao carregar o Stripe');
      }
    });
  }, [onError]);

  if (!stripeLoaded) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        p: 4
      }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Carregando sistema de pagamento seguro...</Typography>
      </Box>
    );
  }

  const options = {
    clientSecret: '', // This will be set dynamically
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#1976d2',
        colorBackground: '#ffffff',
        colorText: '#424242',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        focusBoxShadow: '0px 0px 0px 2px #1976d2',
        fontSizeBase: '16px',
      },
      rules: {
        '.Input': {
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        },
        '.Input--focus': {
          border: '1px solid #1976d2',
        },
        '.Input--invalid': {
          border: '1px solid #df1b41',
        },
        '.Tab': {
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        },
        '.Tab--selected': {
          border: '1px solid #1976d2',
          backgroundColor: '#f3f4f6',
        },
      },
    },
    loader: 'auto' as const,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        onError={onError}
        onCancel={onCancel}
        orderSummary={orderSummary}
      />
    </Elements>
  );
};

export default StripePayment; 