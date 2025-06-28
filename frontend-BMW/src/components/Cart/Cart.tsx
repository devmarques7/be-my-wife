import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  Avatar,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AppButton from '../AppButton/AppButton';

const Cart: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={toggleCart}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          backgroundColor: theme.palette.background.default,
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Carrinho ({cart.itemCount})
          </Typography>
          <IconButton onClick={toggleCart} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Content */}
        {cart.items.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 3,
            textAlign: 'center'
          }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Seu carrinho está vazio
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Adicione alguns presentes para começar
            </Typography>
            <AppButton
              text="Ver Presentes"
              type="primary"
              onClick={() => {
                toggleCart();
                navigate('/presents');
              }}
            />
          </Box>
        ) : (
          <>
            {/* Items List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <List sx={{ p: 0 }}>
                {cart.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ p: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Chip 
                          label={item.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          € {(item.price / 100).toFixed(2)}
                        </Typography>
                        
                        {/* Remove Button */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" color="textSecondary">
                            Produto único
                          </Typography>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ 
                              color: theme.palette.error.main,
                              border: `1px solid ${theme.palette.error.main}`,
                              width: 32,
                              height: 32,
                              '&:hover': {
                                backgroundColor: `${theme.palette.error.main}10`
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </ListItem>
                    {index < cart.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Footer */}
            <Box sx={{ 
              p: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  € {(cart.total / 100).toFixed(2)}
                </Typography>
              </Box>
              
              <Stack spacing={1}>
              <AppButton
                  text="Finalizar Compra"
                  type="primary"
                  onClick={() => handleCheckout()}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    toggleCart();
                    navigate('/presents');
                  }}
                >
                  Continuar Comprando
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart; 