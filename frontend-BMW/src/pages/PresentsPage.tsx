import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "@mui/material";
import { StyledPresents } from "../components/Presents/stylePresents";
import Container from "../components/Container/Container";
import CompactCountDown from "../components/CountDown/CompactCountDown";
import { AppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Chip,
  Slider,
  Stack
} from "@mui/material";
import { IPresent } from "../types/presents";
import PresentModal from "../components/PresentModal/PresentModal";
import AppButton from "../components/AppButton/AppButton";
import Header from "../components/Header/Header";
import Privacy from "../components/Privacy Policy/privacyPolicy";
import { productService } from '../services/productService';
import PresentFilters from '../components/PresentFilters/PresentFilters';

const PresentsPage: React.FC = () => {
  const theme = useTheme();
  const { webContent } = React.useContext(AppContext);
  const { addToCart, isProductInCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedPresent, setSelectedPresent] = useState<IPresent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [presents, setPresents] = useState<IPresent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialPriceRange: [number, number] = [0, 1000000];
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>(initialPriceRange);

  useEffect(() => {
    loadPresents();
  }, []);

  const loadPresents = async () => {
    try {
      const data = await productService.listProducts();
      console.log('Presents from API:', data);
      setPresents(data);
      
      // Configurar o range de preços baseado nos produtos
      if (data.length > 0) {
        const prices = data.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice] as [number, number]);
        setCurrentPriceRange([minPrice, maxPrice] as [number, number]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading presents:', err);
      setError('Falha ao carregar os presentes');
    } finally {
      setLoading(false);
    }
  };

  // Obter categorias únicas dos produtos
  const availableCategories = useMemo(() => {
    const categories = new Set(presents.map(present => present.category));
    return Array.from(categories).sort();
  }, [presents]);

  // Obter range de preços dos produtos
  const priceRangeFromProducts = useMemo(() => {
    if (presents.length === 0) return [0, 1000000];
    const prices = presents.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [presents]);

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setCurrentPriceRange(newValue as [number, number]);
  };

  const filteredAndSortedPresents = useMemo(() => {
    let filtered = presents;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(present => present.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(present => 
      present.price >= currentPriceRange[0] && 
      present.price <= currentPriceRange[1]
    );

    // Filter by availability
    if (availabilityFilter === "available") {
      filtered = filtered.filter(present => !present.isSelected);
    } else if (availabilityFilter === "sold") {
      filtered = filtered.filter(present => present.isSelected);
    }

    // Sort by price
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }, [selectedCategory, sortBy, availabilityFilter, presents, currentPriceRange]);

  const presentsByCategory = useMemo(() => {
    const result: { [key: string]: IPresent[] } = {};
    
    // Se não há categoria selecionada, usar todas as categorias disponíveis
    const categoriesToUse = selectedCategory 
      ? [selectedCategory] 
      : availableCategories;

    categoriesToUse.forEach(category => {
      const presentsInCategory = filteredAndSortedPresents.filter(
        present => present.category === category
      );
      if (presentsInCategory.length > 0) {
        result[category] = presentsInCategory;
      }
    });

    return result;
  }, [filteredAndSortedPresents, selectedCategory, availableCategories]);

  const handleOpenDetails = (present: IPresent) => {
    setSelectedPresent(present);
    setModalOpen(true);
  };

  if (!webContent) {
    return null;
  }

  const { DATETIME_COUNTDOWN, TIME_FIELDS } = webContent.COUNTDOWN;
  const { TITLE, DESCRIPTION } = webContent.PRESENTS;

  if (loading) {
    return (
      <Container id="presents_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h5">Carregando presentes...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container id="presents_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h5" color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container id="presents_page" backgroundType="color" backgroundSrc={theme.palette.primary.main}>
      <Privacy />
      <Header />
      <StyledPresents theme={theme}>
        <CompactCountDown 
          datetime={DATETIME_COUNTDOWN} 
          time_fields={TIME_FIELDS}
        />
        <div className="presents-content">
          <h2>{TITLE}</h2>
          <p>{DESCRIPTION}</p>
          
          <Box sx={{ mb: 4 }}>
            <PresentFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              availableCategories={availableCategories}
              availabilityFilter={availabilityFilter}
              setAvailabilityFilter={setAvailabilityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              currentPriceRange={currentPriceRange}
              priceRangeFromProducts={priceRangeFromProducts}
              handlePriceRangeChange={handlePriceRangeChange}
              totalFilteredItems={filteredAndSortedPresents.length}
            />
          </Box>

          <Stack spacing={4}>
            {Object.entries(presentsByCategory).map(([category, presents]) => (
              <Box key={category}>
                <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 3 }}>
                  {category}
                </Typography>
                <Grid container spacing={3}>
                  {presents.map((present) => (
                    <Grid item xs={12} sm={6} md={4} key={present.id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        backgroundColor: `${theme.palette.primary.main}10`,
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          transition: 'transform 0.3s ease'
                        }
                      }}>
                        <Chip
                          label={present.isSelected ? "Vendido" : "Disponível"}
                          color={present.isSelected ? "error" : "success"}
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1
                          }}
                        />
                        <CardMedia
                          component="img"
                          height="200"
                          image={present.image}
                          alt={present.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="div">
                            {present.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {present.description}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 2,
                              color: 'text.primary',
                              opacity: present.isSelected ? 0.7 : 1,
                              textDecoration: present.isSelected ? 'line-through' : 'none'
                            }}
                          >
                            € {(present.price / 100).toFixed(2)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <AppButton
                              text="Ver Detalhes"
                              type="primary"
                              onClick={() => handleOpenDetails(present)}
                            />
                            <AppButton
                              text={isProductInCart(present.id) ? "Já no Carrinho" : "Adicionar ao Carrinho"}
                              type="dashed"
                              onClick={() => {
                                const success = addToCart(present);
                                if (!success) {
                                  // Produto já está no carrinho, pode mostrar feedback aqui se desejar
                                }
                              }}
                              disabled={isProductInCart(present.id)}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <AppButton
              text="Voltar para a página inicial"
              type="primary"
              navigateTo="/"
            />
          </Box>
        </div>

        <PresentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          present={selectedPresent}
          onSelect={() => {}}
          isSelected={selectedPresent?.isSelected || false}
        />
      </StyledPresents>
    </Container>
  );
};

export default PresentsPage; 