import { useState, useEffect, useCallback, useRef } from 'react';
import { IPresent } from '../types/presents';
import { productService } from '../services/productService';

interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  errorMessage: string | null;
  hasSkeletonData: boolean;
  loadingProgress: number;
}

interface UseOptimizedProductsReturn {
  presents: IPresent[];
  skeletonData: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }> | null;
  loadingState: LoadingState;
  refresh: () => void;
  forceReload: () => void;
}

export const useOptimizedProducts = (): UseOptimizedProductsReturn => {
  const [presents, setPresents] = useState<IPresent[]>([]);
  const [skeletonData, setSkeletonData] = useState<Array<{
    id: string;
    name: string;
    category: string;
    price: number;
  }> | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    isRefreshing: false,
    hasError: false,
    errorMessage: null,
    hasSkeletonData: false,
    loadingProgress: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLoadingState = useCallback((updates: Partial<LoadingState>) => {
    setLoadingState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadSkeletonData = useCallback(() => {
    console.log('📋 Tentando carregar skeleton data...');
    const skeleton = productService.getSkeletonData();
    
    if (skeleton && skeleton.length > 0) {
      setSkeletonData(skeleton);
      updateLoadingState({ hasSkeletonData: true, loadingProgress: 25 });
      console.log(`📋 ${skeleton.length} itens skeleton carregados`);
      return true;
    }
    return false;
  }, [updateLoadingState]);

  const loadProducts = useCallback(async (forceReload = false) => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    const isInitialLoad = loadingState.isLoading && !forceReload;
    const isRefresh = forceReload;

    try {
      updateLoadingState({
        isLoading: isInitialLoad,
        isRefreshing: isRefresh,
        hasError: false,
        errorMessage: null,
        loadingProgress: isInitialLoad ? 0 : 50
      });

      // Para carregamento inicial, tentar skeleton primeiro
      if (isInitialLoad) {
        const hasSkeletonData = loadSkeletonData();
        
        // Se não tem skeleton, mostrar progresso
        if (!hasSkeletonData) {
          updateLoadingState({ loadingProgress: 10 });
        }
      }

      updateLoadingState({ loadingProgress: 50 });
      
      console.log(forceReload ? '🔄 Forçando reload...' : '🔄 Carregando produtos...');
      
      // Timeout para conexões muito lentas
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Timeout: A conexão está muito lenta'));
        }, 30000); // 30 segundos
      });

      const loadPromise = forceReload 
        ? productService.forceReload()
        : productService.listProducts();

      updateLoadingState({ loadingProgress: 75 });

      const data = await Promise.race([loadPromise, timeoutPromise]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setPresents(data);
      updateLoadingState({ 
        loadingProgress: 100,
        hasError: false,
        errorMessage: null
      });
      
      console.log(`✅ ${data.length} produtos carregados com sucesso`);

      // Breve delay para mostrar 100% antes de ocultar loading
      setTimeout(() => {
        updateLoadingState({
          isLoading: false,
          isRefreshing: false,
          loadingProgress: 0
        });
      }, 500);

    } catch (error: any) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Não mostrar erro se a requisição foi cancelada
      if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error('❌ Erro ao carregar presentes:', error);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.message || 
                          'Erro desconhecido ao carregar presentes';
      
      updateLoadingState({
        isLoading: false,
        isRefreshing: false,
        hasError: true,
        errorMessage,
        loadingProgress: 0
      });

      // Se falhou no carregamento inicial e não tem skeleton, usar dados de fallback
      if (isInitialLoad && !skeletonData) {
        console.log('🔄 Usando dados de fallback...');
        // Aqui você poderia ter uma lista básica de fallback
      }
    }
  }, [loadingState.isLoading, loadSkeletonData, updateLoadingState, skeletonData]);

  const refresh = useCallback(() => {
    loadProducts(false);
  }, [loadProducts]);

  const forceReload = useCallback(() => {
    setSkeletonData(null);
    updateLoadingState({ hasSkeletonData: false });
    loadProducts(true);
  }, [loadProducts, updateLoadingState]);

  // Carregar produtos na inicialização
  useEffect(() => {
    loadProducts(false);
    
    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    presents,
    skeletonData,
    loadingState,
    refresh,
    forceReload
  };
};
