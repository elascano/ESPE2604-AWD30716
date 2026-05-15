/**
 * Datos mock de médicos
 */

import { Medico } from '../../types';

export const mockMedicos: Medico[] = [
  {
    id: 1,
    cedula: '1111111111',
    username: '1111111111',
    fullName: 'Dr. Carlos Mendoza',
    role: 'medico',
    especialidad: 'Fisioterapia',
    numeroLicencia: 'MED-2024-001',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0999123456',
    email: 'carlos.mendoza@clinica.com',
    calificacion: 4.8,
    pacientesAtendidos: 150,
    horarioAtencion: [
      { diaSemana: 1, horaInicio: '08:00', horaFin: '16:00' },
      { diaSemana: 2, horaInicio: '08:00', horaFin: '16:00' },
      { diaSemana: 3, horaInicio: '08:00', horaFin: '16:00' },
      { diaSemana: 4, horaInicio: '08:00', horaFin: '16:00' },
      { diaSemana: 5, horaInicio: '08:00', horaFin: '14:00' },
    ],
  },
  {
    id: 2,
    cedula: '0987654321',
    username: '0987654321',
    fullName: 'Dra. María González',
    role: 'medico',
    especialidad: 'Terapia Ocupacional',
    numeroLicencia: 'MED-2024-002',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0998765432',
    email: 'maria.gonzalez@clinica.com',
    calificacion: 4.9,
    pacientesAtendidos: 200,
    horarioAtencion: [
      { diaSemana: 1, horaInicio: '09:00', horaFin: '17:00' },
      { diaSemana: 2, horaInicio: '09:00', horaFin: '17:00' },
      { diaSemana: 3, horaInicio: '09:00', horaFin: '17:00' },
      { diaSemana: 4, horaInicio: '09:00', horaFin: '17:00' },
      { diaSemana: 5, horaInicio: '09:00', horaFin: '15:00' },
    ],
  },
  {
    id: 3,
    cedula: '1122334455',
    username: '1122334455',
    fullName: 'Dr. Roberto Silva',
    role: 'medico',
    especialidad: 'Psicología',
    numeroLicencia: 'MED-2024-003',
    tieneSeguro: true,
    tipoSeguro: 'iess',
    telefono: '0991234567',
    email: 'roberto.silva@clinica.com',
    calificacion: 4.7,
    pacientesAtendidos: 180,
    horarioAtencion: [
      { diaSemana: 1, horaInicio: '10:00', horaFin: '18:00' },
      { diaSemana: 2, horaInicio: '10:00', horaFin: '18:00' },
      { diaSemana: 3, horaInicio: '10:00', horaFin: '18:00' },
      { diaSemana: 4, horaInicio: '10:00', horaFin: '18:00' },
      { diaSemana: 5, horaInicio: '10:00', horaFin: '16:00' },
    ],
  },
];
