import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao abrir a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem('tucano_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sincronizar autenticação entre abas
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'tucano_user') {
        if (event.newValue) {
          setUser(JSON.parse(event.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login - salva o usuário no localStorage
  const login = (nickname, isGuest = false) => {
    const userData = {
      nickname,
      id: Date.now(),
      joinedAt: new Date().toISOString(),
      isGuest, // true se entrou como convidado, false se é piloto registrado
    };
    setUser(userData);
    localStorage.setItem('tucano_user', JSON.stringify(userData));
  };

  // Logout - remove o usuário do localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tucano_user');
  };

  // Atualizar nicknme do usuário
  const updateNickname = (newNickname) => {
    const updatedUser = { ...user, nickname: newNickname };
    setUser(updatedUser);
    localStorage.setItem('tucano_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateNickname,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
