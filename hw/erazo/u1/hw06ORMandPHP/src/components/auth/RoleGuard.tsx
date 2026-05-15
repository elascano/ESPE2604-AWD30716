/**
 * Componente RoleGuard
 * Protege rutas basadas en roles de usuario
 * Basado en el documento de especificaciones técnicas
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Box, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el rol del usuario está permitido
  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          No tienes permisos para acceder a esta sección. Si crees que esto es un error,
          contacta al administrador del sistema.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
}
