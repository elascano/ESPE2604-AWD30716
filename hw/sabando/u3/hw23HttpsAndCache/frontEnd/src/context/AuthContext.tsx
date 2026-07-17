import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TaxPayer } from '../types';
import axios from 'axios';

const BUSINESS_SERVICE_URL = import.meta.env.VITE_BUSINESS_SERVICE_DEPLOY_URL || import.meta.env.VITE_BUSINESS_SERVICE_DEV_URL;

interface AuthContextValue {
  currentUser: TaxPayer | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  updateCurrentUser: (data: Partial<TaxPayer>) => void;
  loginGoogle: (credential: string) => Promise<{ success: boolean; needsProfileCompletion?: boolean }>;
  completeProfile: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const initialUser = stored ? JSON.parse(stored) as TaxPayer : null;
  if (storedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
  const [currentUser, setCurrentUser] = useState<TaxPayer | null>(initialUser);

  const login = useCallback(async (identifier: string, password: string): Promise<boolean> => {
    if (!identifier || !password) {
      console.error('Login validation: identifier and password are required');
      return false;
    }
    try {
      const response = await axios.post(`${BUSINESS_SERVICE_URL}/auth/login`, {
        email: identifier,
        password: password
      });
      if (response.data.success) {
        const { token, data: user } = response.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName, isAdmin: user.role === 'admin' };
        setCurrentUser(mappedUser);
        try {
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
          localStorage.setItem('authToken', token);
        } catch { }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    try {
      const payload = {
        firstName: data.firstName,
        middleName: data.secondName,
        lastName: data.firstLastName,
        secondLastName: data.secondLastName,
        ruc: data.RUC,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate
      };
      const response = await axios.post(`${BUSINESS_SERVICE_URL}/auth/register`, payload);
      if (response.data.success) {
        const { token, data: user } = response.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName };
        setCurrentUser(mappedUser);
        try {
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
          localStorage.setItem('authToken', token);
        } catch { }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  }, []);

  const loginAsAdmin = useCallback(() => {
    setCurrentUser({
      id: '07787dd8-aafa-4c6d-a49c-07595438199d',
      RUC: '1790011223002',
      isAdmin: true,
      firstName: 'David',
      firstLastName: 'Admin',
      email: 'david26@gmail.com',
      birthDate: '1990-01-01',
      createdAt: '2026-05-04T02:06:07.024Z'
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try { localStorage.removeItem('currentUser'); } catch { }
    try { localStorage.removeItem('authToken'); } catch { }
    try { localStorage.removeItem('currentWorkspace'); } catch { }
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const updateCurrentUser = useCallback((data: Partial<TaxPayer>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const loginGoogle = useCallback(async (credential: string) => {
    try {
      const response = await axios.post(`${BUSINESS_SERVICE_URL}/auth/login/google`, { credential });
      if (response.data.success) {
        const { token, data: user } = response.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName };
        if (!response.data.needsProfileCompletion) {
          setCurrentUser(mappedUser);
          try {
            localStorage.setItem('currentUser', JSON.stringify(mappedUser));
            localStorage.setItem('authToken', token);
          } catch { }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          try { localStorage.setItem('incompleteUser', JSON.stringify(mappedUser)); } catch { }
        }
        return { success: true, needsProfileCompletion: response.data.needsProfileCompletion };
      }
      return { success: false };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false };
    }
  }, []);

  const completeProfile = useCallback(async (data: any) => {
    try {
      const stored = localStorage.getItem('incompleteUser');
      if (!stored) return false;
      const incompleteUser = JSON.parse(stored);

      const payload = {
        email: incompleteUser.email,
        firstName: data.firstName,
        middleName: data.secondName,
        lastName: data.firstLastName,
        secondLastName: data.secondLastName,
        ruc: data.RUC,
        birthDate: data.birthDate
      };

      const response = await axios.post(`${BUSINESS_SERVICE_URL}/auth/complete-profile`, payload);
      if (response.data.success) {
        const { token, data: user } = response.data;
        const mappedUser = { ...user, RUC: user.ruc, firstLastName: user.lastName, secondName: user.middleName };
        setCurrentUser(mappedUser);
        try {
          localStorage.setItem('currentUser', JSON.stringify(mappedUser));
          localStorage.setItem('authToken', token);
          localStorage.removeItem('incompleteUser');
        } catch { }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Complete profile error:", error);
      return false;
    }
  }, []);

  const contextValue: AuthContextValue = {
    currentUser,
    isAuthenticated: currentUser !== null,
    login,
    register,
    loginAsAdmin,
    logout,
    updateCurrentUser,
    loginGoogle,
    completeProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
