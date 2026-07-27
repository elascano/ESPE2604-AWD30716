// src/stores/userStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../utils/api';
import { User } from '@/types/index';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const saveUserId = (id: string) => {
    localStorage.setItem('user_id', id);
    apiClient.defaults.headers.common['x-user-id'] = id;
  };

  const mapUserFromApi = (apiUser: any): User => ({
    user_id: apiUser.userId ?? apiUser.user_id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: apiUser.role ?? 'customer',
    created_at: apiUser.createdAt ?? apiUser.created_at ?? new Date(),
    updated_at: apiUser.updatedAt ?? apiUser.updated_at ?? new Date(),
  });

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      const { accessToken, user: userData } = response.data.data;
      setToken(accessToken);
      user.value = mapUserFromApi(userData);
      saveUserId(userData.userId ?? userData.user_id);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al iniciar sesión';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        passwordHash: password,
        phone
      });
      const { accessToken, user: userData } = response.data.data;
      setToken(accessToken);
      user.value = mapUserFromApi(userData);
      saveUserId(userData.userId ?? userData.user_id);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al registrarse';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    setToken(null);
  };

  const getCurrentUser = async () => {
    if (!token.value) return;
    isLoading.value = true;
    try {
      const response = await apiClient.get('/auth/me');
      user.value = mapUserFromApi(response.data.data);
    } catch (err) {
      logout();
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize with stored token
  if (token.value) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    getCurrentUser();
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser
  };
});
