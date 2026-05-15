/**
 * Configuración de Rutas
 * Basado en el documento de especificaciones técnicas
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleGuard from '../components/auth/RoleGuard';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { Box, CircularProgress } from '@mui/material';

// Lazy loading de páginas
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const TherapySelectionPage = lazy(() => import('../pages/therapies/TherapySelectionPage'));
const DoctorSelectionPage = lazy(() => import('../pages/appointments/DoctorSelectionPage'));
const CalendarPage = lazy(() => import('../pages/appointments/CalendarPage'));
const AppointmentFormPage = lazy(() => import('../pages/appointments/AppointmentFormPage'));
const ConfirmationPage = lazy(() => import('../pages/appointments/ConfirmationPage'));
const MyCitasPage = lazy(() => import('../pages/citas/MyCitasPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

// Páginas de Admin
const UsersManagementPage = lazy(() => import('../pages/admin/UsersManagementPage'));
const TherapiesManagementPage = lazy(() => import('../pages/admin/TherapiesManagementPage'));

// Páginas de Médico
const MedicoCitasPage = lazy(() => import('../pages/medico/MedicoCitasPage'));

// Componente de loading
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
    }}
  >
    <CircularProgress size={50} />
  </Box>
);

// Definición de rutas
export const ROUTES = {
  // Autenticación
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Terapias y citas (Paciente)
  TERAPIAS: '/terapias',
  SELECCION_MEDICO: '/seleccion-medico',
  CALENDARIO: '/calendario',
  FORMULARIO_CITA: '/formulario-cita',
  CONFIRMACION: '/confirmacion',
  MIS_CITAS: '/mis-citas',
  
  // Perfil
  PERFIL: '/perfil',
  
  // Admin
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_TERAPIAS: '/admin/terapias',
  
  // Médico
  MEDICO_CITAS: '/medico/citas',
};

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  
  // Rutas protegidas
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.TERAPIAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <TherapySelectionPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.SELECCION_MEDICO,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <DoctorSelectionPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.CALENDARIO,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <CalendarPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.FORMULARIO_CITA,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <AppointmentFormPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.CONFIRMACION,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <ConfirmationPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.MIS_CITAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['paciente']}>
              <MyCitasPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.PERFIL,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      
      // Rutas de Admin
      {
        path: ROUTES.ADMIN_USUARIOS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['admin']}>
              <UsersManagementPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: ROUTES.ADMIN_TERAPIAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['admin']}>
              <TherapiesManagementPage />
            </RoleGuard>
          </Suspense>
        ),
      },
      
      // Rutas de Médico
      {
        path: ROUTES.MEDICO_CITAS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RoleGuard allowedRoles={['medico']}>
              <MedicoCitasPage />
            </RoleGuard>
          </Suspense>
        ),
      },
    ],
  },
  
  // Ruta 404
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export default router;
