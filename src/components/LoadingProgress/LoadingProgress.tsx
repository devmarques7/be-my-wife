import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Fade,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Refresh as RefreshIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon
} from '@mui/icons-material';

interface LoadingProgressProps {
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage: string | null;
  progress: number;
  hasSkeletonData: boolean;
  onRetry: () => void;
  onForceReload: () => void;
}

const getProgressMessage = (progress: number, hasSkeletonData: boolean): string => {
  if (progress === 0) return 'Iniciando carregamento...';
  if (progress <= 25) return hasSkeletonData ? 'Dados básicos carregados' : 'Conectando...';
  if (progress <= 50) return 'Buscando produtos...';
  if (progress <= 75) return 'Carregando detalhes...';
  if (progress <= 90) return 'Finalizando...';
  if (progress === 100) return 'Concluído!';
  return 'Carregando...';
};

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  isLoading,
  isRefreshing,
  hasError,
  errorMessage,
  progress,
  hasSkeletonData,
  onRetry,
  onForceReload
}) => {
  const theme = useTheme();

  if (!isLoading && !isRefreshing && !hasError) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Loading Progress */}
      <Fade in={isLoading || isRefreshing}>
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {hasSkeletonData ? (
                <WifiIcon color="success" fontSize="small" />
              ) : (
                <WifiOffIcon color="warning" fontSize="small" />
              )}
              <Typography variant="body2" color="textSecondary">
                {isRefreshing ? 'Atualizando produtos...' : getProgressMessage(progress, hasSkeletonData)}
              </Typography>
            </Box>
            
            {(isLoading || isRefreshing) && (
              <CircularProgress size={16} />
            )}
          </Box>

          <LinearProgress 
            variant={progress > 0 ? "determinate" : "indeterminate"}
            value={progress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: hasSkeletonData 
                  ? theme.palette.success.main 
                  : theme.palette.primary.main
              }
            }}
          />

          {hasSkeletonData && !isRefreshing && (
            <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
              Exibindo dados em cache enquanto carrega a versão mais recente
            </Typography>
          )}
        </Box>
      </Fade>

      {/* Error State */}
      <Collapse in={hasError}>
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
                startIcon={<RefreshIcon />}
              >
                Tentar Novamente
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={onForceReload}
                variant="outlined"
              >
                Recarregar Tudo
              </Button>
            </Box>
          }
        >
          <Typography variant="body2" fontWeight="bold">
            Erro ao carregar produtos
          </Typography>
          <Typography variant="body2">
            {errorMessage || 'Falha na conexão com o servidor'}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Verifique sua conexão com a internet e tente novamente
          </Typography>
        </Alert>
      </Collapse>

      {/* Connection Status Info */}
      {(isLoading || isRefreshing) && (
        <Fade in={true}>
          <Box sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: theme.palette.grey[50], 
            borderRadius: 1,
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            <Typography variant="caption" color="textSecondary">
              💡 <strong>Dica:</strong> Os produtos são carregados do cache quando possível para acelerar a navegação
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default LoadingProgress;
