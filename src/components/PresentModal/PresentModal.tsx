import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Grid, Divider, useTheme } from '@mui/material';
import { IPresent } from '../../types/presents';
import { useCart } from '../../context/CartContext';
import AppButton from '../AppButton/AppButton';

interface PresentModalProps {
  open: boolean;
  onClose: () => void;
  present: IPresent | null;
  onSelect: () => void;
  isSelected: boolean;
}

const PresentModal: React.FC<PresentModalProps> = ({
  open,
  onClose,
  present
}) => {
  const theme = useTheme();
  const { addToCart, isProductInCart } = useCart();
  
  if (!present) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.secondary.main
          }}
        >
          {present.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Imagem à esquerda */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={present.image}
                alt={present.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: `0 4px 8px ${theme.palette.secondary.dark}`
                }}
              />
            </Box>
          </Grid>

          {/* Detalhes à direita */}
          <Grid item xs={12} md={7}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Categoria */}
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'medium',
                  color: theme.palette.secondary.main
                }}
              >
                Categoria: {present.category}
              </Typography>

              <Divider sx={{ borderColor: theme.palette.secondary.light }} />

              {/* Descrição */}
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme.palette.secondary.main
                  }}
                >
                  Descrição
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    color: theme.palette.secondary.main
                  }}
                >
                  {present.description}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: theme.palette.secondary.light }} />

              {/* Preço */}
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: theme.palette.secondary.main
                  }}
                >
                  Valor do Presente
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.secondary.main
                  }}
                >
                  € {(present.price / 100).toFixed(2)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    color: theme.palette.secondary.main
                  }}
                >
                  Este valor será convertido em um voucher que poderá ser utilizado para a compra do presente.
                </Typography>
              </Box>

              {/* Informações do comprador, se houver */}
              {present.buyerName && (
                <>
                  <Divider sx={{ borderColor: theme.palette.secondary.light }} />
                  <Box sx={{ mt: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: theme.palette.secondary.main
                      }}
                    >
                      Presente Selecionado
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      Selecionado por: {present.buyerName}
                    </Typography>
                    {present.buyerEmail && (
                      <Typography 
                        variant="body2" 
                        sx={{ color: theme.palette.secondary.main }}
                      >
                        Email: {present.buyerEmail}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        <AppButton
          text="Fechar"
          type="dashed"
          onClick={onClose}
        />
        <AppButton
          text={isProductInCart(present.id) ? "Já no Carrinho" : "Adicionar ao Carrinho"}
          type="primary"
          onClick={() => {
            const success = addToCart(present);
            if (success) {
              onClose();
            }
          }}
          disabled={isProductInCart(present.id)}
        />
      </DialogActions>
    </Dialog>
  );
};

export default PresentModal; 