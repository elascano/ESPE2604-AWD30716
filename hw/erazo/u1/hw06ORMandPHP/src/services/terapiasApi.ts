import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Terapia } from '../types';
import { mockTerapias } from './mocks/terapiasMock';

export const terapiasApi = createApi({
  reducerPath: 'terapiasApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Terapias'],
  endpoints: (builder) => ({
    // Obtener todas las terapias activas
    getTerapias: builder.query<Terapia[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const terapias = mockTerapias.filter(t => t.activa);
        return { data: terapias };
      },
      providesTags: ['Terapias'],
    }),
    
    // Obtener terapia por ID
    getTerapiaById: builder.query<Terapia, number | string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const terapia = mockTerapias.find(t => t.id === id);
        if (!terapia) {
          return { error: { status: 404, data: 'Terapia no encontrada' } };
        }
        
        return { data: terapia };
      },
      providesTags: ['Terapias'],
    }),
  }),
});

export const {
  useGetTerapiasQuery,
  useGetTerapiaByIdQuery,
} = terapiasApi;
