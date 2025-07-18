import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  Chip,
  useTheme,
  Grid,
  Paper,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import SortIcon from '@mui/icons-material/Sort';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';

interface PresentFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  availabilityFilter: string;
  setAvailabilityFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  currentPriceRange: number[];
  priceRangeFromProducts: number[];
  handlePriceRangeChange: (event: Event, newValue: number | number[]) => void;
  totalFilteredItems: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: '200px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.secondary.light,
  height: 8,
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}20`,
    },
    '&.Mui-active': {
      width: 32,
      height: 32,
    },
  },
  '& .MuiSlider-rail': {
    height: 8,
    backgroundColor: theme.palette.secondary.light,
    opacity: 0.4,
  },
  '& .MuiSlider-track': {
    height: 8,
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.primary.contrastText,
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  height: 32,
  '& .MuiChip-icon': {
    color: theme.palette.primary.contrastText,
  },
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
}));

const PresentFilters: React.FC<PresentFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  currentPriceRange,
  priceRangeFromProducts,
  handlePriceRangeChange,
  totalFilteredItems,
}) => {
  const theme = useTheme();

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCategory) {
      filters.push({
        label: `Categoria: ${selectedCategory}`,
        icon: <CategoryIcon />,
        onDelete: () => setSelectedCategory(''),
      });
    }
    if (availabilityFilter !== 'all') {
      filters.push({
        label: `Status: ${availabilityFilter === 'available' ? 'Disponíveis' : 'Vendidos'}`,
        icon: <InventoryIcon />,
        onDelete: () => setAvailabilityFilter('all'),
      });
    }
    if (sortBy) {
      filters.push({
        label: `Ordenação: ${sortBy === 'price-asc' ? 'Menor Preço' : 'Maior Preço'}`,
        icon: <SortIcon />,
        onDelete: () => setSortBy('price-asc'),
      });
    }
    if (currentPriceRange[0] !== priceRangeFromProducts[0] || 
        currentPriceRange[1] !== priceRangeFromProducts[1]) {
      filters.push({
        label: `Preço: € ${(currentPriceRange[0] / 100).toFixed(2)} - € ${(currentPriceRange[1] / 100).toFixed(2)}`,
        icon: <AttachMoneyIcon />,
        onDelete: () => handlePriceRangeChange(null as any, priceRangeFromProducts),
      });
    }
    return filters;
  };

  return (
    <StyledPaper elevation={0}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ color: theme.palette.secondary.main, mb: 2 }}
        >
          Filtros de Presentes
        </Typography>
        <Badge 
          badgeContent={totalFilteredItems} 
          color="primary"
          sx={{ 
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.success.main,
              color: theme.palette.primary.main,
            }
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ color: theme.palette.primary.dark }}
          >
            {totalFilteredItems === 1 ? 'Presente encontrado' : 'Presentes encontrados'}
          </Typography>
        </Badge>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledFormControl fullWidth>
            <InputLabel sx={{ color: theme.palette.secondary.main }}>Categoria</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Categoria"
            >
              <MenuItem value="">Todas</MenuItem>
              {availableCategories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StyledFormControl fullWidth>
            <InputLabel sx={{ color: theme.palette.secondary.main }}>Disponibilidade</InputLabel>
            <Select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              label="Disponibilidade"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="available">Disponíveis</MenuItem>
              <MenuItem value="sold">Vendidos</MenuItem>
            </Select>
          </StyledFormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StyledFormControl fullWidth>
            <InputLabel sx={{ color: theme.palette.secondary.main }}>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Ordenar por"
            >
              <MenuItem value="price-asc">Preço: Menor para Maior</MenuItem>
              <MenuItem value="price-desc">Preço: Maior para Menor</MenuItem>
            </Select>
          </StyledFormControl>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          sx={{ color: theme.palette.secondary.main }}
        >
          Faixa de Preço
        </Typography>
        <Typography 
          variant="body2" 
          gutterBottom 
          sx={{ color: theme.palette.primary.dark }}
        >
          € {(currentPriceRange[0] / 100).toFixed(2)} - € {(currentPriceRange[1] / 100).toFixed(2)}
        </Typography>
        <Box sx={{ px: 1 }}>
          <CustomSlider
            value={currentPriceRange}
            onChange={handlePriceRangeChange}
            min={priceRangeFromProducts[0]}
            max={priceRangeFromProducts[1]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `€ ${(value / 100).toFixed(2)}`}
          />
        </Box>
      </Box>

      {getActiveFilters().length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="subtitle2" 
            gutterBottom 
            sx={{ color: theme.palette.secondary.main }}
          >
            Filtros Ativos
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getActiveFilters().map((filter, index) => (
              <StyledChip
                key={index}
                label={filter.label}
                icon={filter.icon}
                onDelete={filter.onDelete}
                deleteIcon={<CancelIcon />}
              />
            ))}
          </Box>
        </Box>
      )}
    </StyledPaper>
  );
};

export default PresentFilters; 