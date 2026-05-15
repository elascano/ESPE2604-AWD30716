/**
 * Servicio de Autenticación Mock
 * Simula llamadas al backend para login y registro
 */

import { LoginCredentials, RegisterData, LoginResult, User } from '../types';
import { mockUsuarios, mockPasswords } from './mocks/usuariosMock';
import { AUTH_TOKEN_KEY } from '../app/axiosClient';

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generar token JWT mock
const generateMockToken = (user: User): string => {
  const payload = {
    id: user.id,
    cedula: user.cedula,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  };
  
  return btoa(JSON.stringify(payload));
};

// Validar token JWT mock
const validateMockToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    
    // Verificar expiración
    if (payload.exp < Date.now()) {
      return null;
    }
    
    // Buscar usuario
    const user = mockUsuarios.find(u => u.id === payload.id);
    return user || null;
  } catch {
    return null;
  }
};

/**
 * Login de usuario
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
  await delay(800);
  
  const { cedula, password } = credentials;
  
  // Buscar usuario por cédula
  const user = mockUsuarios.find(u => u.cedula === cedula);
  
  if (!user) {
    return {
      success: false,
      message: 'Usuario no encontrado. Verifica tu número de cédula.',
    };
  }
  
  // Verificar contraseña
  const storedPassword = mockPasswords[cedula];
  if (storedPassword !== password) {
    return {
      success: false,
      message: 'Contraseña incorrecta.',
    };
  }
  
  // Generar token
  const token = generateMockToken(user);
  
  // Guardar token en sessionStorage
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  
  return {
    success: true,
    user,
    token,
    message: 'Inicio de sesión exitoso',
  };
};

/**
 * Registro de nuevo usuario (solo pacientes)
 */
export const register = async (data: RegisterData): Promise<LoginResult> => {
  await delay(1000);
  
  const { cedula, nombresCompletos, password, direccion, edad, sexo, tipoSeguro, telefono, email } = data;
  
  // Verificar si el usuario ya existe
  const existingUser = mockUsuarios.find(u => u.cedula === cedula);
  if (existingUser) {
    return {
      success: false,
      message: 'Ya existe un usuario registrado con esta cédula.',
    };
  }
  
  // Crear nuevo usuario
  const newUser: User = {
    id: Date.now(),
    cedula,
    username: cedula,
    fullName: nombresCompletos,
    role: 'paciente',
    direccion,
    edad,
    sexo,
    tieneSeguro: tipoSeguro !== 'ninguno', // Mantener compatibilidad
    tipoSeguro,
    telefono,
    email,
    createdAt: new Date().toISOString(),
  };
  
  // Agregar a la lista de usuarios mock
  mockUsuarios.push(newUser);
  mockPasswords[cedula] = password;
  
  // Generar token
  const token = generateMockToken(newUser);
  
  // Guardar token en sessionStorage
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  
  return {
    success: true,
    user: newUser,
    token,
    message: 'Registro exitoso. Bienvenido al sistema.',
  };
};

/**
 * Obtener información del usuario actual
 */
export const getCurrentUser = async (): Promise<User | null> => {
  await delay(300);
  
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }
  
  return validateMockToken(token);
};

/**
 * Cerrar sesión
 */
export const logout = (): void => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Actualizar perfil de usuario
 */
export const updateProfile = async (userId: number | string, updates: Partial<User>): Promise<User | null> => {
  await delay(500);
  
  const userIndex = mockUsuarios.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return null;
  }
  
  // Actualizar usuario
  mockUsuarios[userIndex] = {
    ...mockUsuarios[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockUsuarios[userIndex];
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
  updateProfile,
};
