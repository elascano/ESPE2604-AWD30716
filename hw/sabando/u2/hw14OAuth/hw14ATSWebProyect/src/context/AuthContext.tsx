import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, SriConnectionStatus } from '../types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  sriConnectionStatus: SriConnectionStatus;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  connectToSri: (username: string, password: string) => Promise<boolean>;
  disconnectFromSri: () => void;
  updateCurrentUser: (data: Partial<User>) => void;
  loginWithGoogle: (credential: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [sriConnectionStatus, setSriConnectionStatus] = useState<SriConnectionStatus>('disconnected');

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sessionClosed' && e.newValue === 'true') {
        setCurrentUser(null);
      }
      if (e.key === 'currentUser') {
        setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: identifier,
        password: password
      });
      if (response.data.success) {
        setCurrentUser(response.data.data);
        localStorage.setItem('currentUser', JSON.stringify(response.data.data));
        localStorage.removeItem('sessionClosed');
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
      const response = await axios.post(`${API_URL}/users/register`, data);
      if (response.data.success) {
        setCurrentUser(response.data.data);
        localStorage.setItem('currentUser', JSON.stringify(response.data.data));
        localStorage.removeItem('sessionClosed');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  }, []);

  const loginAsAdmin = useCallback(() => {
    const adminUser = {
      id: '07787dd8-aafa-4c6d-a49c-07595438199d',
      ruc: '1790011223002',
      role: 'admin',
      firstName: 'David',
      lastName: 'Admin',
      email: 'david26@gmail.com',
      birthDate: '1990-01-01',
      createdAt: '2026-05-04T02:06:07.024Z'
    };
    setCurrentUser(adminUser as User);
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    localStorage.removeItem('sessionClosed');
  }, []);

  const loginWithGoogle = useCallback(async (credential: string): Promise<boolean> => {
    try {
      const decoded: any = jwtDecode(credential);
      const googleData = {
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name || decoded.name,
        lastName: decoded.family_name || ''
      };

      const response = await axios.post(`${API_URL}/users/google-login`, googleData);
      
      if (response.data.success) {
        const user = response.data.data;
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('sessionClosed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in Google Login', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSriConnectionStatus('disconnected');
    localStorage.removeItem('currentUser');
    localStorage.setItem('sessionClosed', 'true');
  }, []);

  const connectToSri = useCallback(async (username: string, password: string): Promise<boolean> => {
    setSriConnectionStatus('pending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (username && password) {
      setSriConnectionStatus('connected');
      return true;
    }
    setSriConnectionStatus('disconnected');
    return false;
  }, []);

  const disconnectFromSri = useCallback(() => {
    setSriConnectionStatus('disconnected');
  }, []);

  const updateCurrentUser = useCallback((data: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('currentUser', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const contextValue: AuthContextValue = {
    currentUser,
    isAuthenticated: currentUser !== null,
    sriConnectionStatus,
    login,
    register,
    loginAsAdmin,
    logout,
    connectToSri,
    disconnectFromSri,
    updateCurrentUser,
    loginWithGoogle,
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
