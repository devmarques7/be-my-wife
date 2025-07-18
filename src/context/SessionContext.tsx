import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionData {
  customerInfo: {
    name: string;
    email: string;
  };
  cartItems: Array<{
    id: string;
    presentId: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }>;
  lastUpdate: string;
}

interface SessionContextType {
  // Customer Info
  customerInfo: { name: string; email: string };
  setCustomerInfo: (info: { name: string; email: string }) => void;
  
  // Session management
  saveSession: () => void;
  loadSession: () => void;
  clearSession: () => void;
  
  // Cart backup
  backupCart: (items: any[]) => void;
  getCartBackup: () => any[];
}

const SessionContext = createContext<SessionContextType | null>(null);

const SESSION_STORAGE_KEY = 'bmw_wedding_session';

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfoState] = useState({
    name: '',
    email: ''
  });

  // Função para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Salvar informações do cliente com validação
  const setCustomerInfo = (info: { name: string; email: string }) => {
    const cleanInfo = {
      name: info.name.trim(),
      email: info.email.trim().toLowerCase()
    };

    // Validar antes de salvar
    if (cleanInfo.name && cleanInfo.email && validateEmail(cleanInfo.email)) {
      setCustomerInfoState(cleanInfo);
      console.log('💾 Informações do cliente salvas:', cleanInfo);
    } else {
      console.warn('⚠️ Informações do cliente inválidas, não salvando');
    }
  };

  // Salvar sessão no localStorage
  const saveSession = () => {
    try {
      const sessionData: SessionData = {
        customerInfo,
        cartItems: getCartBackup(),
        lastUpdate: new Date().toISOString()
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('💾 Sessão salva no localStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
    }
  };

  // Carregar sessão do localStorage
  const loadSession = () => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const sessionData: SessionData = JSON.parse(saved);
        
        // Verificar se a sessão não é muito antiga (24 horas)
        const lastUpdate = new Date(sessionData.lastUpdate);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setCustomerInfoState(sessionData.customerInfo || { name: '', email: '' });
          console.log('📦 Sessão carregada do localStorage');
          return sessionData;
        } else {
          console.log('⏰ Sessão expirada, limpando localStorage');
          clearSession();
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar sessão:', error);
      clearSession();
    }
    return null;
  };

  // Limpar sessão
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setCustomerInfoState({ name: '', email: '' });
      console.log('🗑️ Sessão limpa');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
    }
  };

  // Backup do carrinho
  const backupCart = (items: any[]) => {
    try {
      localStorage.setItem(`${SESSION_STORAGE_KEY}_cart`, JSON.stringify(items));
      console.log('🛒 Carrinho salvo no backup');
    } catch (error) {
      console.error('❌ Erro ao fazer backup do carrinho:', error);
    }
  };

  // Recuperar backup do carrinho
  const getCartBackup = (): any[] => {
    try {
      const backup = localStorage.getItem(`${SESSION_STORAGE_KEY}_cart`);
      return backup ? JSON.parse(backup) : [];
    } catch (error) {
      console.error('❌ Erro ao recuperar backup do carrinho:', error);
      return [];
    }
  };

  // Carregar sessão na inicialização
  useEffect(() => {
    loadSession();
  }, []);

  // Auto-save quando customerInfo muda
  useEffect(() => {
    if (customerInfo.name || customerInfo.email) {
      const timer = setTimeout(saveSession, 1000); // Debounce de 1 segundo
      return () => clearTimeout(timer);
    }
  }, [customerInfo]);

  const value = {
    customerInfo,
    setCustomerInfo,
    saveSession,
    loadSession,
    clearSession,
    backupCart,
    getCartBackup
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default SessionContext; 