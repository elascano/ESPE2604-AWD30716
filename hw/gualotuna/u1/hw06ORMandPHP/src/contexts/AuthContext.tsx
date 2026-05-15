/**
 * Contexto de Autenticación
 * Basado en el documento de especificaciones técnicas
 * Adaptado para el sistema médico
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, LoginResult, AuthContextType } from '../types';
import * as authService from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sesión al montar el componente
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Escuchar evento de sesión expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  /**
   * Login de usuario
   */
  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error al iniciar sesión. Intenta nuevamente.',
      };
    }
  };

  /**
   * Registro de nuevo usuario
   */
  const register = async (data: RegisterData): Promise<LoginResult> => {
    try {
      const result = await authService.register(data);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error al registrar usuario. Intenta nuevamente.',
      };
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Refrescar información del usuario
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      setUser(null);
    }
  };

  // Helpers de roles
  const esAdmin = user?.role === 'admin';
  const esPaciente = user?.role === 'paciente';
  const esMedico = user?.role === 'medico';

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    esAdmin,
    esPaciente,
    esMedico,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export default AuthContext;
