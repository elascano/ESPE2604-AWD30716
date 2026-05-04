/**
 * Validaciones de Reglas de Negocio para Citas
 * Implementa las restricciones del sistema
 */

import { Cita } from '../types';

/**
 * Valida que una cita se reserve con más de 24 horas de anticipación
 * @param fecha Fecha de la cita (YYYY-MM-DD)
 * @param hora Hora de la cita (HH:mm)
 * @returns { valid: boolean, message?: string }
 */
export const validarAnticipacionMinima = (fecha: string, hora: string): { valid: boolean; message?: string } => {
  const ahora = new Date();
  const fechaCita = new Date(`${fecha}T${hora}:00`);
  
  const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  
  // Debe ser MAYOR a 24 horas, no igual
  if (diferenciaHoras <= 24) {
    return {
      valid: false,
      message: 'Las citas deben reservarse con más de 24 horas de anticipación.',
    };
  }
  
  return { valid: true };
};

/**
 * Valida que un usuario no tenga otra cita en la misma fecha y hora
 * @param pacienteId ID del paciente
 * @param fecha Fecha de la cita (YYYY-MM-DD)
 * @param hora Hora de la cita (HH:mm)
 * @param citas Lista de citas existentes
 * @returns { valid: boolean, message?: string }
 */
export const validarDobleReserva = (
  pacienteId: number | string,
  fecha: string,
  hora: string,
  citas: Cita[]
): { valid: boolean; message?: string } => {
  const citaExistente = citas.find(
    (cita) =>
      cita.pacienteId === pacienteId &&
      cita.fecha === fecha &&
      cita.hora === hora &&
      (cita.estado === 'pendiente' || cita.estado === 'confirmada')
  );
  
  if (citaExistente) {
    return {
      valid: false,
      message: 'Ya tienes una cita reservada en esta fecha y hora.',
    };
  }
  
  return { valid: true };
};

/**
 * Valida que una cita pueda ser cancelada (más de 24 horas de anticipación)
 * @param fecha Fecha de la cita (YYYY-MM-DD)
 * @param hora Hora de la cita (HH:mm)
 * @returns { valid: boolean, message?: string }
 */
export const validarCancelacion = (fecha: string, hora: string): { valid: boolean; message?: string } => {
  const ahora = new Date();
  const fechaCita = new Date(`${fecha}T${hora}:00`);
  
  const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
  
  // Debe ser MAYOR a 24 horas, no igual
  if (diferenciaHoras <= 24) {
    return {
      valid: false,
      message: 'Solo puedes cancelar citas con más de 24 horas de anticipación.',
    };
  }
  
  return { valid: true };
};

/**
 * Valida que la fecha de la cita no sea en el pasado
 * @param fecha Fecha de la cita (YYYY-MM-DD)
 * @param hora Hora de la cita (HH:mm)
 * @returns { valid: boolean, message?: string }
 */
export const validarFechaFutura = (fecha: string, hora: string): { valid: boolean; message?: string } => {
  const ahora = new Date();
  const fechaCita = new Date(`${fecha}T${hora}:00`);
  
  if (fechaCita <= ahora) {
    return {
      valid: false,
      message: 'No puedes reservar citas en fechas pasadas.',
    };
  }
  
  return { valid: true };
};

/**
 * Valida todas las reglas de negocio para crear una cita
 * @param pacienteId ID del paciente
 * @param fecha Fecha de la cita (YYYY-MM-DD)
 * @param hora Hora de la cita (HH:mm)
 * @param citas Lista de citas existentes
 * @returns { valid: boolean, errors: string[] }
 */
export const validarCreacionCita = (
  pacienteId: number | string,
  fecha: string,
  hora: string,
  citas: Cita[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar fecha futura
  const validacionFecha = validarFechaFutura(fecha, hora);
  if (!validacionFecha.valid && validacionFecha.message) {
    errors.push(validacionFecha.message);
  }
  
  // Validar anticipación mínima
  const validacionAnticipacion = validarAnticipacionMinima(fecha, hora);
  if (!validacionAnticipacion.valid && validacionAnticipacion.message) {
    errors.push(validacionAnticipacion.message);
  }
  
  // Validar doble reserva
  const validacionDobleReserva = validarDobleReserva(pacienteId, fecha, hora, citas);
  if (!validacionDobleReserva.valid && validacionDobleReserva.message) {
    errors.push(validacionDobleReserva.message);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Formatea un mensaje de error para mostrar al usuario
 * @param errors Lista de errores
 * @returns string con los errores formateados
 */
export const formatearErroresCita = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  
  return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
};

export default {
  validarAnticipacionMinima,
  validarDobleReserva,
  validarCancelacion,
  validarFechaFutura,
  validarCreacionCita,
  formatearErroresCita,
};
