/**
 * Página de Perfil
 * Muestra y permite editar información del usuario
 */

import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Divider } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  HealthAndSafety as InsuranceIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'paciente': return 'Paciente';
      case 'medico': return 'Médico';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  const getGenderLabel = (sexo?: string) => {
    switch (sexo) {
      case 'masculino': return 'Masculino';
      case 'femenino': return 'Femenino';
      case 'otro': return 'Otro';
      default: return 'No especificado';
    }
  };

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Información personal y de contacto
        </Typography>
      </Box>

      {/* Card de información principal - Centrado */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.fullName}
            </Typography>
            <Chip
              label={getRoleLabel(user.role)}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Cédula: {user.cedula}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        {/* Card de información detallada */}
        <Grid item xs={12}>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Información Personal
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ color: '#2196F3' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1">{user.fullName}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EmailIcon sx={{ color: '#FF5722' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{user.email || 'No especificado'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PhoneIcon sx={{ color: '#4CAF50' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1">{user.telefono || 'No especificado'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CakeIcon sx={{ color: '#E91E63' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Edad
                      </Typography>
                      <Typography variant="body1">{user.edad || 'No especificado'} años</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <GenderIcon sx={{ color: '#9C27B0' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Sexo
                      </Typography>
                      <Typography variant="body1">{getGenderLabel(user.sexo)}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <InsuranceIcon sx={{ color: '#00BCD4' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Seguro de Salud
                      </Typography>
                      <Typography variant="body1">
                        {user.tieneSeguro ? 'Sí tiene' : 'No tiene'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon sx={{ color: '#FF9800' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1">{user.direccion || 'No especificado'}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
