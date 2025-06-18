import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  useTheme,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { IPresent } from '../../types/presents';

interface ProductSuggestionsProps {
  excludeIds?: string[];
  maxItems?: number;
}

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({ 
  excludeIds = [], 
  maxItems = 4 
}) => {
  const theme = useTheme();
  const { addToCart, cart } = useCart();
  const [suggestions, setSuggestions] = useState<IPresent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [excludeIds]);

  const loadSuggestions = async () => {
    try {
      const allProducts = await productService.listProducts();
      
      // Filtrar produtos que já estão no carrinho
      const cartProductIds = cart.items.map(item => item.presentId);
      const filteredProducts = allProducts.filter(product => 
        !excludeIds.includes(product.id) && 
        !cartProductIds.includes(product.id) &&
        product.active
      );
      
      // Embaralhar e pegar apenas os produtos necessários
      const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, maxItems));
      
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: IPresent) => {
    addToCart(product);
    // Remover o produto das sugestões após adicionar ao carrinho
    setSuggestions(prev => prev.filter(p => p.id !== product.id));
  };

  if (loading || suggestions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Você também pode gostar
      </Typography>
      
      <Grid container spacing={2}>
        {suggestions.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {product.name}
                  </Typography>
                  
                  <Chip 
                    label={product.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}>
                    € {(product.price / 100).toFixed(2)}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      mt: 1
                    }}
                  >
                    Adicionar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductSuggestions; 