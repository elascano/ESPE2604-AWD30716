/**
 * Página de Selección de Terapias
 * Muestra cards con las terapias disponibles
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useGetTerapiasQuery } from '../../services/terapiasApi';
import { Terapia } from '../../types';

export default function TherapySelectionPage() {
  const navigate = useNavigate();
  const { data: terapias = [], isLoading } = useGetTerapiasQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectTerapia = (terapia: Terapia) => {
    // Guardar terapia seleccionada en sessionStorage
    sessionStorage.setItem('selectedTerapia', JSON.stringify(terapia));
    // Navegar a selección de médico
    navigate('/seleccion-medico');
  };

  // Filtrar terapias por búsqueda
  const filteredTerapias = terapias.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Selecciona una Terapia
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Elige la terapia que necesitas y reserva tu cita
        </Typography>
      </Box>

      {/* Barra de búsqueda */}
      <TextField
        fullWidth
        placeholder="Buscar terapias..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Grid de terapias */}
      {filteredTerapias.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron terapias
          </Typography>
        </Box>
      ) : (
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {filteredTerapias.map((terapia) => (
            <Box key={terapia.id}>
              <Card
                sx={{
                  height: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                {/* Imagen de la terapia */}
                <Box sx={{ height: '200px', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
                  <CardMedia
                    component="img"
                    image={terapia.imagen}
                    alt={terapia.nombre}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2, minHeight: '32px' }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="600" 
                      sx={{ 
                        mb: 0, 
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        pr: 1,
                        flex: 1,
                      }}
                    >
                      {terapia.nombre}
                    </Typography>
                    <Chip
                      label={terapia.especialidad}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2.5,
                      height: '63px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {terapia.descripcion}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {terapia.duracion} min
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" fontWeight="600" noWrap>
                        ${terapia.precio.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSelectTerapia(terapia)}
                    sx={{ py: 1.2 }}
                  >
                    Reservar Cita
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
}
