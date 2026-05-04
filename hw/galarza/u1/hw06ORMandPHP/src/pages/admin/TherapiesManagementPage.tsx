/**
 * Página de Gestión de Terapias (Admin)
 * Permite agregar, editar y gestionar terapias
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockTerapias } from '../../services/mocks/terapiasMock';
import { Terapia } from '../../types';
import Swal from 'sweetalert2';

// Schema de validación para terapia
const terapiaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duracion: z.number().min(15, 'La duración mínima es 15 minutos').max(180, 'La duración máxima es 180 minutos'),
  precio: z.number().min(0, 'El precio debe ser mayor a 0'),
  especialidad: z.string().min(3, 'La especialidad es requerida'),
  imagen: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type TerapiaFormData = z.infer<typeof terapiaSchema>;

export default function TherapiesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTerapia, setEditingTerapia] = useState<Terapia | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TerapiaFormData>({
    resolver: zodResolver(terapiaSchema),
  });

  // Filtrar terapias
  const terapiasFiltradas = mockTerapias.filter((terapia) =>
    terapia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    terapia.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (terapia?: Terapia) => {
    if (terapia) {
      setEditingTerapia(terapia);
      reset({
        nombre: terapia.nombre,
        descripcion: terapia.descripcion,
        duracion: terapia.duracion,
        precio: terapia.precio,
        especialidad: terapia.especialidad,
        imagen: terapia.imagen || '',
      });
    } else {
      setEditingTerapia(null);
      reset({
        nombre: '',
        descripcion: '',
        duracion: 60,
        precio: 0,
        especialidad: '',
        imagen: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTerapia(null);
    reset();
  };

  const onSubmit = async (data: TerapiaFormData) => {
    try {
      if (editingTerapia) {
        // Actualizar terapia existente
        const index = mockTerapias.findIndex((t) => t.id === editingTerapia.id);
        if (index !== -1) {
          mockTerapias[index] = {
            ...mockTerapias[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        await Swal.fire('Actualizada', 'La terapia ha sido actualizada exitosamente', 'success');
      } else {
        // Crear nueva terapia
        const nuevaTerapia: Terapia = {
          id: Date.now(),
          ...data,
          activa: true,
          createdAt: new Date().toISOString(),
        };
        mockTerapias.push(nuevaTerapia);
        await Swal.fire('Creada', 'La terapia ha sido creada exitosamente', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      await Swal.fire('Error', 'No se pudo guardar la terapia', 'error');
    }
  };

  const handleToggleActive = async (terapia: Terapia) => {
    const result = await Swal.fire({
      title: terapia.activa ? '¿Desactivar terapia?' : '¿Activar terapia?',
      text: terapia.activa
        ? 'La terapia no estará disponible para nuevas citas'
        : 'La terapia estará disponible para nuevas citas',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const index = mockTerapias.findIndex((t) => t.id === terapia.id);
      if (index !== -1) {
        mockTerapias[index].activa = !mockTerapias[index].activa;
      }
      await Swal.fire(
        'Actualizada',
        `La terapia ha sido ${terapia.activa ? 'desactivada' : 'activada'}`,
        'success'
      );
    }
  };

  const handleDelete = async (terapia: Terapia) => {
    const result = await Swal.fire({
      title: '¿Eliminar terapia?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
    });

    if (result.isConfirmed) {
      const index = mockTerapias.findIndex((t) => t.id === terapia.id);
      if (index !== -1) {
        mockTerapias.splice(index, 1);
      }
      await Swal.fire('Eliminada', 'La terapia ha sido eliminada', 'success');
    }
  };

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Terapias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra el catálogo de terapias disponibles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => handleOpenDialog()}
        >
          Nueva Terapia
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {mockTerapias.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Terapias
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {mockTerapias.filter((t) => t.activa).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {mockTerapias.filter((t) => !t.activa).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactivas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                ${(mockTerapias.reduce((sum, t) => sum + t.precio, 0) / mockTerapias.length).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio Promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Buscador */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Grid de terapias */}
      <Grid container spacing={3}>
        {terapiasFiltradas.map((terapia) => (
          <Grid item xs={12} sm={6} md={4} key={terapia.id}>
            <Card>
              {terapia.imagen && (
                <CardMedia
                  component="img"
                  height="200"
                  image={terapia.imagen}
                  alt={terapia.nombre}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    {terapia.nombre}
                  </Typography>
                  <Chip
                    label={terapia.activa ? 'Activa' : 'Inactiva'}
                    color={terapia.activa ? 'success' : 'default'}
                    size="small"
                    icon={terapia.activa ? <ActiveIcon /> : <InactiveIcon />}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {terapia.descripcion}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Duración: {terapia.duracion} min
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    ${terapia.precio.toFixed(2)}
                  </Typography>
                </Box>

                <Chip label={terapia.especialidad} size="small" sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(terapia)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={terapia.activa ? 'Desactivar' : 'Activar'}>
                    <IconButton
                      size="small"
                      color={terapia.activa ? 'warning' : 'success'}
                      onClick={() => handleToggleActive(terapia)}
                    >
                      {terapia.activa ? <InactiveIcon /> : <ActiveIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(terapia)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar terapia */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingTerapia ? 'Editar Terapia' : 'Nueva Terapia'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Terapia"
                  {...register('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  {...register('descripcion')}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Especialidad"
                  {...register('especialidad')}
                  error={!!errors.especialidad}
                  helperText={errors.especialidad?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="duracion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Duración (minutos)"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      error={!!errors.duracion}
                      helperText={errors.duracion?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Precio (USD)"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      error={!!errors.precio}
                      helperText={errors.precio?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="URL de Imagen (opcional)"
                  {...register('imagen')}
                  error={!!errors.imagen}
                  helperText={errors.imagen?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingTerapia ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
