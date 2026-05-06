/**
 * Página de Calendario
 * Paso 1: Selección de fecha y hora
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Person as PersonIcon } from '@mui/icons-material';
import { useGetHorariosDisponiblesQuery } from '../../services/citasApi';
import { ROUTES } from '../../app/router';
import { Terapia, Medico } from '../../types';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHora, setSelectedHora] = useState<string>('');
  const [terapia, setTerapia] = useState<Terapia | null>(null);
  const [medico, setMedico] = useState<Medico | null>(null);

  // Cargar terapia y médico seleccionados desde sessionStorage
  useEffect(() => {
    const terapiaStr = sessionStorage.getItem('selectedTerapia');
    const medicoStr = sessionStorage.getItem('selectedMedico');
    
    if (!terapiaStr || !medicoStr) {
      // Si falta alguno, redirigir al inicio del flujo
      navigate(ROUTES.TERAPIAS);
      return;
    }
    
    setTerapia(JSON.parse(terapiaStr));
    setMedico(JSON.parse(medicoStr));
  }, [navigate]);

  // Generar próximos 7 días
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = generateDates();
  
  // Obtener horarios disponibles filtrados por médico seleccionado
  const { data: horariosRaw = [], isLoading } = useGetHorariosDisponiblesQuery(
    { terapiaId: terapia?.id || 0, fecha: selectedDate || dates[0] },
    { skip: !terapia || !medico }
  );
  
  // Filtrar horarios solo del médico seleccionado Y que estén disponibles
  const horarios = horariosRaw.filter(h => h.medicoId === medico?.id && h.disponible);

  const handleContinue = () => {
    if (!selectedDate || !selectedHora || !medico) {
      return;
    }

    // Guardar selección en sessionStorage
    sessionStorage.setItem('appointmentData', JSON.stringify({
      terapiaId: terapia?.id,
      fecha: selectedDate,
      hora: selectedHora,
      medicoId: medico.id,
    }));

    navigate(ROUTES.FORMULARIO_CITA);
  };

  if (!terapia || !medico) {
    return (
      <Box>
        <Alert severity="error">
          No se ha completado la selección. Por favor, selecciona una terapia y un médico primero.
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
          onClick={() => navigate(ROUTES.SELECCION_MEDICO)}
          sx={{ mb: 2 }}
        >
          Volver a Selección de Médico
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Selecciona Fecha y Hora
        </Typography>
        
        {/* Información de terapia y médico seleccionados */}
        <Card sx={{ mt: 2, bgcolor: 'primary.50', borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Terapia seleccionada
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {terapia.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {terapia.duracion} min • ${terapia.precio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Médico seleccionado
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {medico.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {medico.especialidad}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        {/* Selección de fecha */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                1. Selecciona una Fecha
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {dates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  
                  return (
                    <Grid item xs={6} sm={4} key={date}>
                      <Button
                        fullWidth
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedHora('');
                        }}
                        sx={{ py: 2, flexDirection: 'column' }}
                      >
                        <Typography variant="caption">
                          {dateObj.toLocaleDateString('es-ES', { weekday: 'short' })}
                        </Typography>
                        <Typography variant="h6">
                          {dateObj.getDate()}
                        </Typography>
                        <Typography variant="caption">
                          {dateObj.toLocaleDateString('es-ES', { month: 'short' })}
                        </Typography>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Selección de hora */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                2. Selecciona una Hora
              </Typography>
              
              {!selectedDate ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Primero selecciona una fecha
                </Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : horarios.length === 0 ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No hay horarios disponibles para esta fecha
                </Alert>
              ) : (
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {horarios.map((horario) => {
                    const isSelected = selectedHora === horario.hora;
                    
                    return (
                      <Grid item xs={6} sm={4} key={`${horario.hora}-${horario.medicoId}`}>
                        <Button
                          fullWidth
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => {
                            setSelectedHora(horario.hora);
                          }}
                          disabled={!horario.disponible}
                          sx={{ py: 1.5 }}
                        >
                          {horario.hora}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumen y botón continuar */}
      {selectedDate && selectedHora && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Resumen de tu Selección
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Chip label={`Fecha: ${new Date(selectedDate).toLocaleDateString('es-ES')}`} color="primary" />
              <Chip label={`Hora: ${selectedHora}`} color="primary" />
            </Box>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleContinue}
              sx={{ mt: 3 }}
            >
              Continuar al Formulario
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
