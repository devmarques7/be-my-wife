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
  Paper
} from '@mui/material';

// Configurar Stripe - usando a chave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RXU0ZI0TsQHOnFwg28fpk96PaG1UKbufQQtRa69mb69Cd3ViBggHzVYh0vglb6foJ7cWlCKTG5w982qqJUv0Vy100Z3kWamJq');

interface SimpleStripePaymentProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo?: {
    name: string;
    email: string;
  };
}

const PaymentForm: React.FC<{
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo?: { name: string; email: string };
}> = ({ onSuccess, onError, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Função para validar email com mais rigor
  const validateEmail = (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) return false;

    // Regex mais rigoroso para email
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]@[a-zA-Z0-9]([a-zA-Z0-9-])*[a-zA-Z0-9]\.([a-zA-Z]{2,})+$/;
    return emailRegex.test(trimmedEmail.toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validar informações do cliente
    if (!customerInfo?.email || !customerInfo?.name) {
      setErrorMessage('Informações do cliente são obrigatórias para processar o pagamento');
      onError('Informações do cliente são obrigatórias para processar o pagamento');
      return;
    }

    // Validação mais rigorosa para o nome
    if (customerInfo.name.trim().length < 2) {
      setErrorMessage('Nome deve ter pelo menos 2 caracteres');
      onError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!validateEmail(customerInfo.email)) {
      setErrorMessage('Por favor, insira um endereço de email válido (ex: nome@dominio.com)');
      onError('Por favor, insira um endereço de email válido (ex: nome@dominio.com)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('💳 Informações do cliente para pagamento:', customerInfo);
      console.log('💳 Email validado:', validateEmail(customerInfo.email));
      console.log('💳 Nome limpo:', customerInfo.name.trim());
      console.log('💳 Email limpo:', customerInfo.email.trim().toLowerCase());

      // Preparar billing details limpos
      const cleanBillingDetails = {
        name: customerInfo.name.trim(),
        email: customerInfo.email.trim().toLowerCase(),
      };

      console.log('💳 Billing details finais:', cleanBillingDetails);

      // Configurar confirmParams baseado na configuração do PaymentElement
      const baseConfirmParams = {
        return_url: `${window.location.origin}/success`,
      };

      // Se temos customerInfo, significa que configuramos billing_details como 'never'
      // então DEVEMOS passar os billing_details no confirmParams
      const confirmParams = customerInfo ? {
        ...baseConfirmParams,
        payment_method_data: {
          billing_details: cleanBillingDetails,
        },
      } : baseConfirmParams;

      console.log('💳 ConfirmParams configurados:', confirmParams);

      // Primeira tentativa com configuração apropriada
      let result = await stripe.confirmPayment({
        elements,
        confirmParams,
        redirect: 'if_required'
      });

      let { error } = result;

      // Se houve erro relacionado ao email e tínhamos billing_details, tentar sem eles
      if (error && customerInfo && (error.code === 'email_invalid' || error.message?.includes('email') || error.message?.includes('billing_details'))) {
        console.log('⚠️ Erro detectado, tentando abordagem alternativa...');
        console.log('⚠️ Erro original:', error.message);

        // Tentar sem billing_details manual (deixar o Elements coletar automaticamente)
        result = await stripe.confirmPayment({
          elements,
          confirmParams: baseConfirmParams,
          redirect: 'if_required'
        });

        error = result.error;
        console.log('💳 Segunda tentativa resultado:', error ? 'ERRO' : 'SUCESSO');
      }

      if (error) {
        console.error('❌ Erro no pagamento:', error);
        console.error('❌ Código do erro:', error.code);
        console.error('❌ Tipo do erro:', error.type);
        console.error('❌ Param do erro:', error.param);

        let errorMessage = error.message || 'Erro desconhecido no pagamento';

        // Mensagens específicas para diferentes tipos de erro
        if (error.code === 'email_invalid') {
          errorMessage = 'O endereço de email fornecido não é válido. Por favor, verifique e tente novamente.';
        } else if (error.type === 'card_error') {
          errorMessage = `Erro no cartão: ${error.message}`;
        } else if (error.type === 'validation_error') {
          errorMessage = `Dados inválidos: ${error.message}`;
        }

        setErrorMessage(errorMessage);
        onError(errorMessage);
      } else {
        console.log('✅ Pagamento processado com sucesso!');
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado:', error);
      const errorMsg = error?.message || 'Erro inesperado durante o pagamento';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <PaymentElement
          options={{
            layout: 'accordion',
            paymentMethodOrder: ['ideal', 'card', 'paypal', 'klarna'],
            defaultValues: {
              billingDetails: customerInfo ? {
                name: customerInfo.name,
                email: customerInfo.email
              } : undefined
            },
            fields: {
              billingDetails: 'auto'
            }
          }}
        />
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!stripe || isProcessing}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Processando...
          </>
        ) : (
          'Finalizar Pagamento'
        )}
      </Button>
    </form>
  );
};

const SimpleStripePayment: React.FC<SimpleStripePaymentProps> = ({
  clientSecret,
  onSuccess,
  onError,
  customerInfo
}) => {
  if (!clientSecret) {
    return (
      <Alert severity="warning">
        Client secret não fornecido para o pagamento
      </Alert>
    );
  }

  // Configuração com prioridade para iDEAL e cartão
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#424242',
      colorDanger: '#df1b41',
      fontFamily: 'Roboto, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  };

  const options = {
    clientSecret,
    appearance,
    // Definir ordem dos métodos de pagamento com iDEAL em primeiro
    paymentMethodOrder: ['ideal', 'card', 'paypal', 'klarna']
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Escolha seu Método de Pagamento
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Métodos disponíveis: iDEAL (recomendado), Cartão, PayPal, Klarna e outros
      </Typography>

      <Elements options={options} stripe={stripePromise}>
        <PaymentForm
          onSuccess={onSuccess}
          onError={onError}
          customerInfo={customerInfo}
        />
      </Elements>
    </Paper>
  );
};

export default SimpleStripePayment; 