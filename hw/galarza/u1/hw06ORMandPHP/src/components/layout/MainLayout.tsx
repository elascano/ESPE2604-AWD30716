/**
 * Layout Principal
 * Basado en el documento de especificaciones técnicas
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalHospital as HospitalIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 260;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon sx={{ color: '#2196F3' }} />,
    path: '/dashboard',
  },
  {
    text: 'Terapias',
    icon: <HospitalIcon sx={{ color: '#4CAF50' }} />,
    path: '/terapias',
    roles: ['paciente'],
  },
  {
    text: 'Mis Citas',
    icon: <EventNoteIcon sx={{ color: '#FF9800' }} />,
    path: '/mis-citas',
    roles: ['paciente'],
  },
  {
    text: 'Mis Citas',
    icon: <EventNoteIcon sx={{ color: '#FF9800' }} />,
    path: '/medico/citas',
    roles: ['medico'],
  },
  {
    text: 'Gestión de Usuarios',
    icon: <PersonIcon sx={{ color: '#9C27B0' }} />,
    path: '/admin/usuarios',
    roles: ['admin'],
  },
  {
    text: 'Gestión de Terapias',
    icon: <HospitalIcon sx={{ color: '#4CAF50' }} />,
    path: '/admin/terapias',
    roles: ['admin'],
  },
  {
    text: 'Perfil',
    icon: <PersonIcon sx={{ color: '#9C27B0' }} />,
    path: '/perfil',
  },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const drawerWidth = sidebarCollapsed ? 70 : DRAWER_WIDTH;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Filtrar menú según rol
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Logo del sidebar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#2196F3',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        }}
      >
        <HospitalIcon sx={{ fontSize: 32, color: 'white' }} />
        {!sidebarCollapsed && (
          <Typography variant="h6" color="white" fontWeight="bold">
            SER SALUD
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: '#E0E0E0' }} />

      {/* Menú de navegación */}
      <List sx={{ flexGrow: 1, py: 2, px: sidebarCollapsed ? 0.5 : 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ px: sidebarCollapsed ? 0 : 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  px: sidebarCollapsed ? 1 : 2,
                  borderLeft: isActive ? '4px solid #2196F3' : '4px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: '#E3F2FD',
                    '&:hover': {
                      bgcolor: '#BBDEFB',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#F5F5F5',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed ? 'auto' : 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: '#424242',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#E0E0E0' }} />

      {/* Botón para colapsar/expandir */}
      {!isMobile && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{
              color: '#757575',
              '&:hover': {
                bgcolor: '#F5F5F5',
              },
            }}
          >
            {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      )}

      {/* Información del usuario en el sidebar */}
      {!sidebarCollapsed && (
        <Box sx={{ p: 2, bgcolor: '#F5F5F5' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Sesión iniciada como:
          </Typography>
          <Typography variant="body2" fontWeight="600" noWrap color="#424242">
            {user?.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.role === 'paciente' ? 'Paciente' : user?.role === 'medico' ? 'Médico' : 'Administrador'}
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar Superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          transition: 'width 0.3s, margin 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            SER SALUD
          </Typography>

          {/* Avatar y menú de usuario */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.fullName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || user?.cedula}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/perfil'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s',
        }}
      >
        {/* Drawer móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en móvil
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#FFFFFF',
              borderRight: '1px solid #E0E0E0',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#FFFFFF',
              borderRight: '1px solid #E0E0E0',
              transition: 'width 0.3s',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: 'width 0.3s, margin 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
