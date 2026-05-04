/**
 * Página de Citas del Médico
 * Permite al médico ver sus citas asignadas y su agenda
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
  Tabs,
  Tab,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockCitas } from '../../services/mocks/citasMock';
import { mockUsuarios } from '../../services/mocks/usuariosMock';
import { mockTerapias } from '../../services/mocks/terapiasMock';
import { Cita } from '../../types';
import Swal from 'sweetalert2';

export default function MedicoCitasPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Obtener citas del médico
  const citasMedico = mockCitas
    .filter((cita) => cita.medicoId === user?.id)
    .map((cita) => ({
      ...cita,
      paciente: mockUsuarios.find((u) => u.id === cita.pacienteId),
      terapia: mockTerapias.find((t) => t.id === cita.terapiaId),
    }));

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'completada':
        return 'info';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filtrar citas según tab
  const citasFiltradas = citasMedico.filter((cita) => {
    const fechaCita = new Date(cita.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (tabValue === 0) {
      // Hoy
      return fechaCita.toDateString() === hoy.toDateString() && cita.estado !== 'cancelada';
    }
    if (tabValue === 1) {
      // Próximas
      return fechaCita > hoy && (cita.estado === 'pendiente' || cita.estado === 'confirmada');
    }
    if (tabValue === 2) {
      // Completadas
      return cita.estado === 'completada';
    }
    if (tabValue === 3) {
      // Todas
      return true;
    }
    return true;
  });

  const handleConfirmarCita = async (cita: Cita) => {
    const result = await Swal.fire({
      title: '¿Confirmar cita?',
      text: 'La cita será marcada como confirmada',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const index = mockCitas.findIndex((c) => c.id === cita.id);
      if (index !== -1) {
        mockCitas[index].estado = 'confirmada';
      }
      await Swal.fire('Confirmada', 'La cita ha sido confirmada', 'success');
    }
  };

  const handleCompletarCita = async (cita: Cita) => {
    const { value: notas } = await Swal.fire({
      title: 'Completar cita',
      input: 'textarea',
      inputLabel: 'Notas de la consulta (opcional)',
      inputPlaceholder: 'Escribe las notas de la consulta...',
      showCancelButton: true,
      confirmButtonText: 'Completar',
      cancelButtonText: 'Cancelar',
    });

    if (notas !== undefined) {
      const index = mockCitas.findIndex((c) => c.id === cita.id);
      if (index !== -1) {
        mockCitas[index].estado = 'completada';
        mockCitas[index].notas = notas;
      }
      await Swal.fire('Completada', 'La cita ha sido marcada como completada', 'success');
    }
  };

  // Estadísticas
  const citasHoy = citasMedico.filter((c) => {
    const fechaCita = new Date(c.fecha);
    const hoy = new Date();
    return fechaCita.toDateString() === hoy.toDateString() && c.estado !== 'cancelada';
  }).length;

  const citasPendientes = citasMedico.filter(
    (c) => c.estado === 'pendiente' || c.estado === 'confirmada'
  ).length;

  const citasCompletadas = citasMedico.filter((c) => c.estado === 'completada').length;

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mis Citas Médicas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus citas y consultas
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {citasHoy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Citas Hoy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {citasPendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {citasCompletadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Hoy" />
          <Tab label="Próximas" />
          <Tab label="Completadas" />
          <Tab label="Todas" />
        </Tabs>
      </Box>

      {/* Lista de citas */}
      {citasFiltradas.length === 0 ? (
        <Alert severity="info">No tienes citas en esta categoría</Alert>
      ) : (
        <Grid container spacing={3}>
          {citasFiltradas.map((cita) => (
            <Grid item xs={12} key={cita.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Información del paciente */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                          {cita.paciente?.fullName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {cita.paciente?.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cédula: {cita.paciente?.cedula}
                          </Typography>
                        </Box>
                      </Box>
                      {cita.paciente?.telefono && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{cita.paciente.telefono}</Typography>
                        </Box>
                      )}
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    {/* Información de la cita */}
                    <Grid item xs={12} md={7}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="600">
                          {cita.terapia?.nombre}
                        </Typography>
                        <Chip label={cita.estado} color={getEstadoColor(cita.estado)} size="small" />
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

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Síntomas:</strong> {cita.sintomas}
                      </Typography>

                      {cita.tieneExamenes && (
                        <Chip label="Tiene exámenes" size="small" color="info" sx={{ mt: 1 }} />
                      )}

                      {cita.notas && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <strong>Notas:</strong> {cita.notas}
                        </Alert>
                      )}

                      {/* Acciones */}
                      {cita.estado === 'pendiente' && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleConfirmarCita(cita)}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleCompletarCita(cita)}
                          >
                            Completar
                          </Button>
                        </Box>
                      )}

                      {cita.estado === 'confirmada' && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleCompletarCita(cita)}
                          >
                            Marcar como Completada
                          </Button>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
