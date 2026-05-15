/**
 * Datos mock de usuarios para autenticación
 */

import { User } from '../../types';

export const mockUsuarios: User[] = [
  // Paciente de prueba
  {
    id: 100,
    cedula: '1234567890',
    username: '1234567890',
    fullName: 'Juan Pérez García',
    role: 'paciente',
    direccion: 'Av. Principal 123, Quito',
    edad: 35,
    sexo: 'masculino',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0999888777',
    email: 'juan.perez@email.com',
  },
  
  // Médicos
  {
    id: 1,
    cedula: '1111111111',
    username: '1111111111',
    fullName: 'Dr. Carlos Mendoza',
    role: 'medico',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0999123456',
    email: 'carlos.mendoza@clinica.com',
    especialidad: 'Fisioterapia',
    numeroLicencia: 'MED-2024-001',
  },
  {
    id: 2,
    cedula: '0987654321',
    username: '0987654321',
    fullName: 'Dra. María González',
    role: 'medico',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0998765432',
    email: 'maria.gonzalez@clinica.com',
    especialidad: 'Terapia Ocupacional',
    numeroLicencia: 'MED-2024-002',
  },
  {
    id: 3,
    cedula: '1122334455',
    username: '1122334455',
    fullName: 'Dr. Roberto Silva',
    role: 'medico',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0991234567',
    email: 'roberto.silva@clinica.com',
    especialidad: 'Psicología',
    numeroLicencia: 'MED-2024-003',
  },
  
  // Administrador
  {
    id: 999,
    cedula: 'admin',
    username: 'admin',
    fullName: 'Administrador del Sistema',
    role: 'admin',
    tieneSeguro: true,
    tipoSeguro: 'privado',
    telefono: '0999000000',
    email: 'admin@clinica.com',
  },
];

// Contraseñas mock (en producción esto estaría en el backend)
export const mockPasswords: Record<string, string> = {
  '1234567890': 'password123',  // Paciente
  '1111111111': 'medico123',    // Dr. Carlos Mendoza
  '0987654321': 'medico123',    // Dra. María González
  '1122334455': 'medico123',    // Dr. Roberto Silva
  'admin': 'admin123',          // Admin
};
