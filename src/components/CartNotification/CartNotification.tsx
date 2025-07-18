import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import { Close as CloseIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

interface CartNotificationProps {
  onViewCart?: () => void;
}

const CartNotification: React.FC<CartNotificationProps> = ({ onViewCart }) => {
  const theme = useTheme();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<any>(null);
  const [prevItemCount, setPrevItemCount] = useState(0);

  useEffect(() => {
    // Detectar quando um item foi adicionado ao carrinho
    if (cart.itemCount > prevItemCount && cart.items.length > 0) {
      const newestItem = cart.items[cart.items.length - 1];
      setLastAddedItem(newestItem);
      setOpen(true);
    }
    setPrevItemCount(cart.itemCount);
  }, [cart.itemCount, cart.items, prevItemCount]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (!lastAddedItem) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0
        }
      }}
    >
      <Alert
        severity="success"
        onClose={handleClose}
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%',
            padding: 0
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
          <Avatar
            src={lastAddedItem.image}
            alt={lastAddedItem.name}
            variant="rounded"
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AlertTitle sx={{ fontSize: '0.875rem', m: 0 }}>
              Item adicionado ao carrinho!
            </AlertTitle>
            <Typography 
              variant="body2" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mt: 0.5
              }}
            >
              {lastAddedItem.name}
            </Typography>
          </Box>
          {onViewCart && (
            <IconButton
              size="small"
              onClick={() => {
                onViewCart();
                setOpen(false);
              }}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CartNotification; 