/**
 * Página de Selección de Médico
 * Muestra los médicos disponibles para la terapia seleccionada
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Rating,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useGetMedicosByEspecialidadQuery } from '../../services/medicosApi';
import { Terapia, Medico } from '../../types';

export default function DoctorSelectionPage() {
  const navigate = useNavigate();
  const [selectedTerapia, setSelectedTerapia] = useState<Terapia | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);

  // Cargar terapia seleccionada desde sessionStorage
  useEffect(() => {
    const terapiaStr = sessionStorage.getItem('selectedTerapia');
    if (terapiaStr) {
      setSelectedTerapia(JSON.parse(terapiaStr));
    } else {
      // Si no hay terapia seleccionada, redirigir a terapias
      navigate('/terapias');
    }
  }, [navigate]);

  // Obtener médicos por especialidad
  const { data: medicos = [], isLoading } = useGetMedicosByEspecialidadQuery(
    selectedTerapia?.especialidad || '',
    { skip: !selectedTerapia }
  );

  const handleSelectMedico = (medico: Medico) => {
    setSelectedMedico(medico);
  };

  const handleContinuar = () => {
    if (selectedMedico) {
      // Guardar médico seleccionado en sessionStorage
      sessionStorage.setItem('selectedMedico', JSON.stringify(selectedMedico));
      navigate('/calendario');
    }
  };

  const handleVolver = () => {
    navigate('/terapias');
  };

  const getDiasAtencion = (medico: Medico): string => {
    if (!medico.horarioAtencion || medico.horarioAtencion.length === 0) {
      return 'No especificado';
    }

    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const diasAtencion = medico.horarioAtencion
      .map(h => dias[h.diaSemana])
      .join(', ');
    
    return diasAtencion;
  };

  const getHorarioAtencion = (medico: Medico): string => {
    if (!medico.horarioAtencion || medico.horarioAtencion.length === 0) {
      return 'No especificado';
    }

    // Tomar el primer horario como referencia
    const horario = medico.horarioAtencion[0];
    return `${horario.horaInicio} - ${horario.horaFin}`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Botón volver */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleVolver}
        sx={{ mb: 3 }}
      >
        Volver a Terapias
      </Button>

      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Selecciona un Médico
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Elige el médico especialista para tu terapia de <strong>{selectedTerapia?.nombre}</strong>
        </Typography>
      </Box>

      {/* Información de la terapia seleccionada */}
      {selectedTerapia && (
        <Card sx={{ mb: 4, bgcolor: 'primary.50', borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckIcon color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {selectedTerapia.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTerapia.especialidad} • {selectedTerapia.duracion} min • ${selectedTerapia.precio.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Lista de médicos */}
      {medicos.length === 0 ? (
        <Alert severity="info">
          No hay médicos disponibles para esta especialidad en este momento.
        </Alert>
      ) : (
        <>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
            Médicos Disponibles ({medicos.length})
          </Typography>

          <Grid container spacing={3}>
            {medicos.map((medico) => (
              <Grid item xs={12} md={6} key={medico.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid',
                    borderColor: selectedMedico?.id === medico.id ? 'primary.main' : 'transparent',
                    bgcolor: selectedMedico?.id === medico.id ? 'primary.50' : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleSelectMedico(medico)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {/* Avatar */}
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: 'primary.main',
                          fontSize: '2rem',
                        }}
                      >
                        {medico.fullName.charAt(0)}
                      </Avatar>

                      {/* Información del médico */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {medico.fullName}
                        </Typography>
                        <Chip
                          label={medico.especialidad}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Lic. {medico.numeroLicencia}
                        </Typography>
                      </Box>

                      {/* Indicador de selección */}
                      {selectedMedico?.id === medico.id && (
                        <CheckIcon color="primary" sx={{ fontSize: 32 }} />
                      )}
                    </Box>

                    {/* Calificación y pacientes */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating
                          value={medico.calificacion || 0}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary">
                          {medico.calificacion?.toFixed(1)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        •
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {medico.pacientesAtendidos} pacientes
                        </Typography>
                      </Box>
                    </Box>

                    {/* Horario de atención */}
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          Horario de Atención
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getDiasAtencion(medico)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getHorarioAtencion(medico)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Botón continuar */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinuar}
              disabled={!selectedMedico}
              sx={{ minWidth: 200 }}
            >
              Continuar al Calendario
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
