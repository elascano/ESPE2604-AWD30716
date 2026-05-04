/**
 * Página de Gestión de Usuarios (Admin)
 * Permite visualizar y gestionar usuarios del sistema
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
  TextField,
  InputAdornment,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { mockUsuarios } from '../../services/mocks/usuariosMock';
import { UserRole } from '../../types';

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'todos'>('todos');

  // Filtrar usuarios
  const usuariosFiltrados = mockUsuarios.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'medico':
        return 'primary';
      case 'paciente':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'medico':
        return 'Médico';
      case 'paciente':
        return 'Paciente';
      default:
        return role;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {params.row.fullName.charAt(0).toUpperCase()}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'fullName',
      headerName: 'Nombre Completo',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'cedula',
      headerName: 'Cédula',
      width: 130,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getRoleLabel(params.value)}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <EmailIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      ),
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra todos los usuarios del sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          size="large"
        >
          Nuevo Usuario
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {mockUsuarios.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Usuarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {mockUsuarios.filter((u) => u.role === 'paciente').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pacientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {mockUsuarios.filter((u) => u.role === 'medico').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Médicos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {mockUsuarios.filter((u) => u.role === 'admin').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, cédula o email..."
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
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Filtrar por Rol"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'todos')}
              >
                <MenuItem value="todos">Todos los roles</MenuItem>
                <MenuItem value="paciente">Pacientes</MenuItem>
                <MenuItem value="medico">Médicos</MenuItem>
                <MenuItem value="admin">Administradores</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent>
          <DataGrid
            rows={usuariosFiltrados}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
