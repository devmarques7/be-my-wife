import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  List,
  ListItem,
  Avatar,
  Stack,
  Chip,
  Button,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  AccountBalance as BankIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { AppContext } from '../context/AppContext';
import AppButton from '../components/AppButton/AppButton';
import ProductSuggestions from '../components/ProductSuggestions/ProductSuggestions';
import { ICheckoutForm } from '../types/cart';
import { productService } from '../services/productService';

const CheckoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { webContent } = useContext(AppContext);

  const [formData, setFormData] = useState<ICheckoutForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ICheckoutForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

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
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log()
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simular chamada de API
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const presentIds = cart.items.map(item => item.presentId)
      const paymentUrl = await productService.presentPurchase(presentIds)

      // Limpar carrinho após compra bem-sucedida
      clearCart();
      setSubmitted(true);

      // Redirecionar após alguns segundos
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 3000);

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              Redirecionando para a página inicial...
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container id="checkout_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
      <Header />
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/presents')}
            sx={{ color: theme.palette.text.primary }}
          >
            Voltar
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Finalizar Compra
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {/* Formulário */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Informações de Entrega
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
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
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CEP"
                      value={formData.zipCode}
                      onChange={handleInputChange('zipCode')}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      value={formData.address}
                      onChange={handleInputChange('address')}
                      error={!!errors.address}
                      helperText={errors.address}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      value={formData.city}
                      onChange={handleInputChange('city')}
                      error={!!errors.city}
                      helperText={errors.city}
                      required
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Método de Pagamento */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Método de Pagamento
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CreditCardIcon />
                        <Typography>Cartão de Crédito</Typography>
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    value="pix"
                    control={<Radio />}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PixIcon />
                        <Typography>PIX</Typography>
                      </Stack>
                    }
                  />
                  <FormControlLabel
                    value="transfer"
                    control={<Radio />}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <BankIcon />
                        <Typography>Transferência Bancária</Typography>
                      </Stack>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>

          {/* Resumo do Pedido */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Resumo do Pedido
              </Typography>

              <List sx={{ p: 0 }}>
                {cart.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Produto único
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          € {(item.price / 100).toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < cart.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  € {(cart.total / 100).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Sugestões de Produtos */}
        <ProductSuggestions
          excludeIds={cart.items.map(item => item.presentId)}
          maxItems={4}
        />
      </Box>
    </Container>
  );
};

export default CheckoutPage; 