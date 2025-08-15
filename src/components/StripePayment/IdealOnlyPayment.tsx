import React, { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { AccountBalance as BankIcon } from '@mui/icons-material';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RXU0ZI0TsQHOnFwg28fpk96PaG1UKbufQQtRa69mb69Cd3ViBggHzVYh0vglb6foJ7cWlCKTG5w982qqJUv0Vy100Z3kWamJq');

interface IdealOnlyPaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
  };
}

const IdealPaymentForm: React.FC<{
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo: { name: string; email: string };
}> = ({ onSuccess, onError, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('🏦 Processando pagamento iDEAL...');
      console.log('🏦 Cliente:', customerInfo);

      // Validar dados obrigatórios para iDEAL
      if (!customerInfo?.name || !customerInfo?.email) {
        throw new Error('Nome e email são obrigatórios para pagamento iDEAL');
      }

      if (customerInfo.name.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }

      const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.([a-zA-Z]{2,})+$/;
      if (!emailRegex.test(customerInfo.email.trim().toLowerCase())) {
        throw new Error('Email deve ter formato válido (ex: nome@dominio.com)');
      }

      // Para iDEAL, configurar corretamente os billing_details
      console.log('🏦 Configurando pagamento iDEAL com billing_details obrigatórios...');
      
      const confirmParams = {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: {
            name: customerInfo.name.trim(),
            email: customerInfo.email.trim().toLowerCase(),
          },
        },
      };

      console.log('🏦 ConfirmParams iDEAL:', confirmParams);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams,
        redirect: 'if_required'
      });

      if (error) {
        console.error('❌ Erro no pagamento iDEAL:', error);
        
        let errorMessage = error.message || 'Erro ao processar pagamento iDEAL';
        
        if (error.code === 'email_invalid') {
          errorMessage = 'Por favor, verifique se preencheu corretamente seu nome e email no formulário acima.';
        }
        
        setErrorMessage(errorMessage);
        onError(errorMessage);
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('✅ Pagamento iDEAL realizado com sucesso!');
        onSuccess();
      } else if (paymentIntent?.status === 'processing') {
        console.log('⏳ Pagamento iDEAL em processamento...');
        onSuccess();
      } else if (paymentIntent?.status === 'requires_action') {
        console.log('🔄 Redirecionando para autenticação iDEAL...');
        // O usuário será redirecionado para o banco
      }
    } catch (err: any) {
      console.error('❌ Erro inesperado no iDEAL:', err);
      const errorMsg = 'Erro inesperado ao processar pagamento iDEAL';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header iDEAL */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BankIcon />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Pagamento iDEAL
            </Typography>
            <Typography variant="body2">
              Você será redirecionado para seu banco para autorizar o pagamento de forma segura.
            </Typography>
          </Box>
        </Stack>
      </Alert>

      {/* PaymentElement configurado apenas para iDEAL */}
      <Box sx={{ mb: 3 }}>
        <PaymentElement 
          options={{
            layout: 'accordion',
            paymentMethodOrder: ['ideal'],
            fields: {
              billingDetails: 'never' // Coletamos via props customerInfo
            }
          }}
        />
      </Box>

      {/* Mensagem de Erro */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Botão de Pagamento */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!stripe || isProcessing}
        fullWidth
        startIcon={<BankIcon />}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Processando iDEAL...
          </>
        ) : (
          'Pagar com iDEAL'
        )}
      </Button>

      {/* Informações Adicionais */}
      <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        Cliente: {customerInfo.name} ({customerInfo.email})
      </Typography>
    </form>
  );
};

const IdealOnlyPayment: React.FC<IdealOnlyPaymentProps> = ({
  clientSecret,
  onSuccess,
  onError,
  customerInfo
}) => {
  if (!clientSecret) {
    return (
      <Alert severity="warning">
        Client secret não fornecido para o pagamento iDEAL
      </Alert>
    );
  }

  // Configuração específica para iDEAL
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#424242',
      fontFamily: 'Roboto, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  };

  const options = {
    clientSecret,
    appearance,
    // Configurar apenas para iDEAL
    paymentMethodOrder: ['ideal']
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Pagamento via iDEAL (Holanda)
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Método bancário mais popular na Holanda - conecta diretamente ao seu banco.
      </Typography>

      <Elements options={options} stripe={stripePromise}>
        <IdealPaymentForm 
          onSuccess={onSuccess} 
          onError={onError} 
          customerInfo={customerInfo}
        />
      </Elements>
    </Paper>
  );
};

export default IdealOnlyPayment; 