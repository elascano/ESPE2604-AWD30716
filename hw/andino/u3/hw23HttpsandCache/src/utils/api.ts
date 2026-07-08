// src/utils/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://3.20.57.154:3000/ops';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userId = localStorage.getItem('user_id');
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && typeof data === 'object') {
      if ('data' in data) {
        if (!('success' in data)) {
          data.success = true;
        }
      } else {
        response.data = {
          success: true,
          data: data
        };
      }
    } else {
      response.data = {
        success: true,
        data: data
      };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!error.response) {
      const networkError = new Error(
        'Error de conexión. Verifica tu internet o intenta más tarde.'
      );
      return Promise.reject(networkError);
    }

    const serverError = new Error(
      error.response?.data?.error ||
        `Error del servidor (${error.response?.status})`
    );
    return Promise.reject(serverError);
  }
);

export default apiClient;
