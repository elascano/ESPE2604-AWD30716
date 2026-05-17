/**
 * Cliente HTTP Axios configurado
 * Basado en el documento de especificaciones técnicas
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración base de la API
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Clave para almacenar el token JWT
export const AUTH_TOKEN_KEY = 'auth_token';

// Crear instancia de Axios
const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitudes - Agregar token JWT
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - Manejo de errores
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      
      // Disparar evento para que AuthContext maneje el cierre de sesión
      window.dispatchEvent(new Event('auth:session-expired'));
      
      // Redirigir a login si no estamos ya ahí
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Manejo de errores de servidor
    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }
    
    // Manejo de errores de red
    if (!error.response) {
      console.error('Error de red:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
