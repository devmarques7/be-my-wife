import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Skeleton,
  Box,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ProductSkeletonProps {
  showBasicInfo?: boolean;
  data?: {
    id: string;
    name: string;
    category: string;
    price: number;
  };
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ 
  showBasicInfo = false, 
  data 
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: `${theme.palette.primary.main}10`,
      position: 'relative',
      opacity: showBasicInfo ? 0.8 : 1
    }}>
      {/* Status Chip */}
      <Chip
        label={showBasicInfo ? "Carregando..." : <Skeleton width={80} />}
        color="default"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1
        }}
      />

      {/* Image Skeleton */}
      {showBasicInfo && data ? (
        <Box sx={{ position: 'relative', height: 200 }}>
          <Skeleton 
            variant="rectangular" 
            height={200} 
            animation="wave"
            sx={{ bgcolor: 'grey.300' }}
          />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="textSecondary">
              Carregando imagem...
            </Typography>
          </Box>
        </Box>
      ) : (
        <Skeleton variant="rectangular" height={200} animation="wave" />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Product Name */}
        {showBasicInfo && data ? (
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
        ) : (
          <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
        )}

        {/* Description */}
        {showBasicInfo && data ? (
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
        )}

        {/* Price */}
        {showBasicInfo && data ? (
          <Typography 
            variant="h6" 
            sx={{ mb: 2, color: 'text.primary' }}
          >
            € {(data.price / 100).toFixed(2)}
          </Typography>
        ) : (
          <Skeleton variant="text" height={28} width="40%" sx={{ mb: 2 }} />
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" height={36} width={100} />
          <Skeleton variant="rounded" height={36} width={150} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Grid container para múltiplos skeletons
export const ProductSkeletonGrid: React.FC<{ 
  count?: number; 
  skeletonData?: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }> | null;
}> = ({ count = 6, skeletonData }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
          <ProductSkeleton 
            showBasicInfo={!!skeletonData}
            data={skeletonData?.[index]}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductSkeleton;
