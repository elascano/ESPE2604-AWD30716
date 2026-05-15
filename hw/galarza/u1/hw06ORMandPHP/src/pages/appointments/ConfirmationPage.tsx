/**
 * Página de Confirmación
 * Paso 3: Confirmar y crear la cita
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateCitaMutation } from '../../services/citasApi';
import { ROUTES } from '../../app/router';
import Swal from 'sweetalert2';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createCita, { isLoading }] = useCreateCitaMutation();
  const [error, setError] = useState<string | null>(null);

  // Obtener datos guardados
  const terapiaStr = sessionStorage.getItem('selectedTerapia');
  const medicoStr = sessionStorage.getItem('selectedMedico');
  const appointmentDataStr = sessionStorage.getItem('appointmentData');
  
  const terapia = terapiaStr ? JSON.parse(terapiaStr) : null;
  const medico = medicoStr ? JSON.parse(medicoStr) : null;
  const appointmentData = appointmentDataStr ? JSON.parse(appointmentDataStr) : null;

  const handleConfirm = async () => {
    if (!user || !appointmentData) {
      setError('Faltan datos para crear la cita');
      return;
    }

    try {
      const result = await createCita({
        pacienteId: user.id,
        data: appointmentData,
      }).unwrap();

      // Limpiar sessionStorage
      sessionStorage.removeItem('selectedTerapia');
      sessionStorage.removeItem('selectedMedico');
      sessionStorage.removeItem('appointmentData');

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Cita Reservada!',
        text: 'Tu cita ha sido reservada exitosamente',
        confirmButtonText: 'Ver Mis Citas',
      });

      navigate(ROUTES.MIS_CITAS);
    } catch (err) {
      setError('Error al crear la cita. Intenta nuevamente.');
    }
  };

  if (!terapia || !medico || !appointmentData) {
    return (
      <Box>
        <Alert severity="error">
          No se encontraron datos de la cita. Por favor, inicia el proceso desde el principio.
        </Alert>
        <Button onClick={() => navigate(ROUTES.TERAPIAS)} sx={{ mt: 2 }}>
          Volver a Terapias
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.FORMULARIO_CITA)}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Confirmar Cita
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Revisa los datos antes de confirmar
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Datos del paciente */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Datos del Paciente
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1">{user?.fullName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cédula
                  </Typography>
                  <Typography variant="body1">{user?.cedula}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">{user?.telefono || 'No especificado'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Datos de la cita */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Datos de la Cita
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Terapia
                  </Typography>
                  <Typography variant="body1">{terapia.nombre}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Médico
                  </Typography>
                  <Typography variant="body1">{medico.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {medico.especialidad}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body1">
                    {new Date(appointmentData.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Hora
                  </Typography>
                  <Typography variant="body1">{appointmentData.hora}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Duración
                  </Typography>
                  <Typography variant="body1">{terapia.duracion} minutos</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Precio
                  </Typography>
                  <Typography variant="body1">${terapia.precio.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información médica */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Información Médica
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Síntomas
                </Typography>
                <Typography variant="body1">{appointmentData.sintomas}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Exámenes Médicos
                </Typography>
                {appointmentData.tieneExamenes ? (
                  <Chip label="Sí tiene exámenes" color="success" size="small" />
                ) : (
                  <Chip label="No tiene exámenes" color="default" size="small" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón confirmar */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            onClick={handleConfirm}
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? 'Confirmando...' : 'Confirmar Cita'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
