import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData, token = null) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setIsAuthModalOpen(false);
  }, []);

  const openLogin = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthModalOpen,
    login,
    logout,
    openLogin,
    closeLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}