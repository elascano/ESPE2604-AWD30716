import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Medico } from '../types';
import { mockMedicos } from './mocks/medicosMock';

export const medicosApi = createApi({
  reducerPath: 'medicosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Medicos'],
  endpoints: (builder) => ({
    // Obtener todos los médicos
    getMedicos: builder.query<Medico[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: mockMedicos };
      },
      providesTags: ['Medicos'],
    }),
    
    // Obtener médico por ID
    getMedicoById: builder.query<Medico, number | string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const medico = mockMedicos.find(m => m.id === id);
        if (!medico) {
          return { error: { status: 404, data: 'Médico no encontrado' } };
        }
        
        return { data: medico };
      },
      providesTags: ['Medicos'],
    }),
    
    // Obtener médicos por especialidad
    getMedicosByEspecialidad: builder.query<Medico[], string>({
      queryFn: async (especialidad) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const medicos = mockMedicos.filter(m => m.especialidad === especialidad);
        return { data: medicos };
      },
      providesTags: ['Medicos'],
    }),
  }),
});

export const {
  useGetMedicosQuery,
  useGetMedicoByIdQuery,
  useGetMedicosByEspecialidadQuery,
} = medicosApi;
