/**
 * Datos mock de citas y horarios
 */

import { Cita, HorarioDisponible } from '../../types';

export const mockCitas: Cita[] = [
  {
    id: 1,
    pacienteId: 100,
    medicoId: 1,
    terapiaId: 1,
    fecha: '2026-05-05',
    hora: '10:00',
    estado: 'confirmada',
    sintomas: 'Dolor en la rodilla derecha después de correr',
    tieneExamenes: false,
    createdAt: '2026-04-26T10:00:00Z',
  },
  {
    id: 2,
    pacienteId: 100,
    medicoId: 3,
    terapiaId: 3,
    fecha: '2026-05-08',
    hora: '14:00',
    estado: 'pendiente',
    sintomas: 'Ansiedad y estrés laboral',
    tieneExamenes: false,
    createdAt: '2026-04-26T11:00:00Z',
  },
];

// Generar horarios disponibles para los próximos 7 días
const generarHorariosDisponibles = (): HorarioDisponible[] => {
  const horarios: HorarioDisponible[] = [];
  const hoy = new Date(); // Usar fecha actual del sistema
  
  for (let dia = 1; dia <= 7; dia++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + dia);
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Horarios de 8:00 a 17:00 cada hora
    for (let hora = 8; hora <= 17; hora++) {
      const horaStr = `${hora.toString().padStart(2, '0')}:00`;
      
      // Alternar disponibilidad para simular realismo
      const disponible = Math.random() > 0.3;
      
      horarios.push({
        fecha: fechaStr,
        hora: horaStr,
        disponible,
        medicoId: 1,
        medicoNombre: 'Dr. Carlos Mendoza',
      });
      
      horarios.push({
        fecha: fechaStr,
        hora: horaStr,
        disponible: Math.random() > 0.3,
        medicoId: 2,
        medicoNombre: 'Dra. María González',
      });
    }
  }
  
  return horarios;
};

export const mockHorariosDisponibles = generarHorariosDisponibles();
