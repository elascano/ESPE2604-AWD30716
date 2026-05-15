/**
 * Configuración del Store de Redux
 * Basado en el documento de especificaciones técnicas
 */

import { configureStore } from '@reduxjs/toolkit';
import { citasApi } from '../services/citasApi';
import { terapiasApi } from '../services/terapiasApi';
import { medicosApi } from '../services/medicosApi';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [citasApi.reducerPath]: citasApi.reducer,
    [terapiasApi.reducerPath]: terapiasApi.reducer,
    [medicosApi.reducerPath]: medicosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(citasApi.middleware)
      .concat(terapiasApi.middleware)
      .concat(medicosApi.middleware),
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
