import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cita, AppointmentFormData, HorarioDisponible } from '../types';
import { mockCitas, mockHorariosDisponibles } from './mocks/citasMock';
import { validarCreacionCita, formatearErroresCita, validarCancelacion } from '../utils/citasValidations';

export const citasApi = createApi({
  reducerPath: 'citasApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Citas'],
  endpoints: (builder) => ({
    // Obtener todas las citas del paciente
    getCitasPaciente: builder.query<Cita[], number | string>({
      queryFn: async (pacienteId) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const citas = mockCitas.filter(c => c.pacienteId === pacienteId);
        return { data: citas };
      },
      providesTags: ['Citas'],
    }),
    
    // Obtener próximas citas del paciente
    getProximasCitas: builder.query<Cita[], number | string>({
      queryFn: async (pacienteId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const ahora = new Date();
        const citas = mockCitas
          .filter(c => c.pacienteId === pacienteId)
          .filter(c => new Date(c.fecha) >= ahora)
          .filter(c => c.estado !== 'cancelada')
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(0, 5);
        
        return { data: citas };
      },
      providesTags: ['Citas'],
    }),
    
    // Obtener horarios disponibles
    getHorariosDisponibles: builder.query<HorarioDisponible[], { terapiaId: number | string; fecha: string }>({
      queryFn: async ({ fecha }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generar horarios dinámicamente para la fecha solicitada
        const horarios: HorarioDisponible[] = [];
        const ahora = new Date();
        
        // Horarios de 8:00 a 17:00 cada hora
        for (let hora = 8; hora <= 17; hora++) {
          const horaStr = `${hora.toString().padStart(2, '0')}:00`;
          
          // Crear fecha y hora completa para validar
          const fechaHoraCita = new Date(`${fecha}T${horaStr}:00`);
          const diferenciaHoras = (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
          
          // Solo mostrar horarios con MÁS de 24 horas de anticipación (no exactamente 24)
          // Si no cumple con 24 horas, SIEMPRE debe estar NO disponible
          const cumple24Horas = diferenciaHoras > 24;
          
          // Si no cumple 24 horas, forzar a false
          let disponible = false;
          if (cumple24Horas) {
            // Solo si cumple 24 horas, aplicar randomización para simular disponibilidad
            disponible = Math.random() > 0.3;
          }
          
          // Agregar horarios para diferentes médicos
          horarios.push({
            fecha,
            hora: horaStr,
            disponible,
            medicoId: 1,
            medicoNombre: 'Dr. Carlos Mendoza',
          });
          
          // Para otros médicos, misma lógica
          let disponible2 = false;
          if (cumple24Horas) {
            disponible2 = Math.random() > 0.3;
          }
          
          horarios.push({
            fecha,
            hora: horaStr,
            disponible: disponible2,
            medicoId: 2,
            medicoNombre: 'Dra. María González',
          });
          
          let disponible3 = false;
          if (cumple24Horas) {
            disponible3 = Math.random() > 0.3;
          }
          
          horarios.push({
            fecha,
            hora: horaStr,
            disponible: disponible3,
            medicoId: 3,
            medicoNombre: 'Dr. Roberto Silva',
          });
        }
        
        return { data: horarios };
      },
      // Deshabilitar caché para siempre obtener horarios actualizados
      keepUnusedDataFor: 0,
    }),
    
    // Crear nueva cita
    createCita: builder.mutation<Cita, { pacienteId: number | string; data: AppointmentFormData }>({
      queryFn: async ({ pacienteId, data }) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Validar reglas de negocio
        const validacion = validarCreacionCita(pacienteId, data.fecha, data.hora, mockCitas);
        
        if (!validacion.valid) {
          return { 
            error: { 
              status: 400, 
              data: formatearErroresCita(validacion.errors) 
            } 
          };
        }
        
        const nuevaCita: Cita = {
          id: Date.now(),
          pacienteId,
          medicoId: data.medicoId,
          terapiaId: data.terapiaId,
          fecha: data.fecha,
          hora: data.hora,
          estado: 'pendiente',
          sintomas: data.sintomas,
          tieneExamenes: data.tieneExamenes,
          examenes: data.tieneExamenes ? [] : undefined,
          createdAt: new Date().toISOString(),
        };
        
        mockCitas.push(nuevaCita);
        
        return { data: nuevaCita };
      },
      invalidatesTags: ['Citas'],
    }),
    
    // Cancelar cita
    cancelarCita: builder.mutation<Cita, { citaId: number | string; motivo: string }>({
      queryFn: async ({ citaId, motivo }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const cita = mockCitas.find(c => c.id === citaId);
        if (!cita) {
          return { error: { status: 404, data: 'Cita no encontrada' } };
        }
        
        // Validar que se pueda cancelar (24 horas de anticipación)
        const validacion = validarCancelacion(cita.fecha, cita.hora);
        if (!validacion.valid) {
          return { 
            error: { 
              status: 400, 
              data: validacion.message || 'No se puede cancelar la cita' 
            } 
          };
        }
        
        cita.estado = 'cancelada';
        cita.motivoCancelacion = motivo;
        cita.updatedAt = new Date().toISOString();
        
        return { data: cita };
      },
      invalidatesTags: ['Citas'],
    }),
  }),
});

export const {
  useGetCitasPacienteQuery,
  useGetProximasCitasQuery,
  useGetHorariosDisponiblesQuery,
  useCreateCitaMutation,
  useCancelarCitaMutation,
} = citasApi;
