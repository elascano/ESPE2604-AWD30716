/**
 * Página de Mis Citas
 * Muestra todas las citas del paciente
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useGetCitasPacienteQuery, useCancelarCitaMutation } from '../../services/citasApi';
import Swal from 'sweetalert2';

export default function MyCitasPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const { data: citas = [], isLoading } = useGetCitasPacienteQuery(user?.id || 0);
  const [cancelarCita] = useCancelarCitaMutation();

  const handleCancelar = async (citaId: number | string) => {
    const result = await Swal.fire({
      title: '¿Cancelar cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#d32f2f',
    });

    if (result.isConfirmed) {
      const { value: motivo } = await Swal.fire({
        title: 'Motivo de cancelación',
        input: 'textarea',
        inputPlaceholder: 'Escribe el motivo...',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Debes escribir un motivo';
          }
        },
      });

      if (motivo) {
        try {
          await cancelarCita({ citaId, motivo }).unwrap();
          Swal.fire('Cancelada', 'La cita ha sido cancelada', 'success');
        } catch {
          Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
        }
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'success';
      case 'pendiente': return 'warning';
      case 'completada': return 'info';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  // Filtrar citas según tab
  const citasFiltradas = citas.filter((cita) => {
    if (tabValue === 0) return true; // Todas
    if (tabValue === 1) return cita.estado === 'pendiente' || cita.estado === 'confirmada'; // Próximas
    if (tabValue === 2) return cita.estado === 'completada'; // Completadas
    if (tabValue === 3) return cita.estado === 'cancelada'; // Canceladas
    return true;
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mis Citas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona todas tus citas médicas
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Todas" />
          <Tab label="Próximas" />
          <Tab label="Completadas" />
          <Tab label="Canceladas" />
        </Tabs>
      </Box>

      {/* Lista de citas */}
      {citasFiltradas.length === 0 ? (
        <Alert severity="info">
          No tienes citas en esta categoría
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {citasFiltradas.map((cita) => (
            <Grid item xs={12} md={6} key={cita.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      {cita.terapia?.nombre || 'Terapia'}
                    </Typography>
                    <Chip
                      label={cita.estado}
                      color={getEstadoColor(cita.estado)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(cita.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2">{cita.hora}</Typography>
                  </Box>

                  {cita.medico && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Médico: {cita.medico.fullName}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Síntomas: {cita.sintomas}
                  </Typography>

                  {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancelar(cita.id)}
                      sx={{ mt: 2 }}
                    >
                      Cancelar Cita
                    </Button>
                  )}

                  {cita.estado === 'cancelada' && cita.motivoCancelacion && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Motivo: {cita.motivoCancelacion}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
