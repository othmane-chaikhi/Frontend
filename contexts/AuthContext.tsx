'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, isStaff, getUser } from '@/lib/auth';
import { User } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isStaff: boolean;
  user: User | null;
  updateAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isStaff: false,
  user: null,
  updateAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [staff, setStaff] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const updateAuth = () => {
    const isAuth = isAuthenticated();
    const isStaffUser = isStaff();
    const userData = getUser();
    
    setAuthenticated(isAuth);
    setStaff(isStaffUser);
    setUser(userData);
  };

  useEffect(() => {
    updateAuth();

    // Vérifier périodiquement
    const interval = setInterval(updateAuth, 1000);

    // Écouter les changements de storage
    const handleStorageChange = () => {
      updateAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, isStaff: staff, user, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

