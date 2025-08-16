import { styled } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';

export const StyledCartDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
}));

export const CartHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 64,
}));

export const CartContent = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

export const EmptyCartContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

export const CartFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: `0 -2px 8px ${theme.palette.grey[200]}`,
}));

export const QuantityControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiIconButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    width: 32,
    height: 32,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const CartItemContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  
  '& .cart-item-image': {
    width: 60,
    height: 60,
    borderRadius: theme.shape.borderRadius,
    flexShrink: 0,
  },
  
  '& .cart-item-content': {
    flex: 1,
    minWidth: 0,
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    '& .cart-item-image': {
      width: 50,
      height: 50,
    },
  },
})); 