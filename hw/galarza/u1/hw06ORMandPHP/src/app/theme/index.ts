/**
 * Configuración del tema Material-UI
 * Adaptado del sistema de gestión de riesgos para contexto médico
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    divider: colors.divider,
    action: colors.action,
  },
  
  typography,
  
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8,
  
  components: {
    // Botones
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    
    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    
    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    
    // TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    
    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    // Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.sidebar,
          color: '#FFFFFF',
          borderRight: 'none',
        },
      },
    },
    
    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    
    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    
    // Tabs
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    
    // DataGrid - Comentado porque no es parte del tema base de MUI
    // Se puede personalizar directamente en el componente si es necesario
    // MuiDataGrid: {
    //   styleOverrides: {
    //     root: {
    //       border: 'none',
    //       '& .MuiDataGrid-cell': {
    //         borderBottom: `1px solid ${colors.divider}`,
    //       },
    //       '& .MuiDataGrid-columnHeaders': {
    //         backgroundColor: colors.background.default,
    //         borderBottom: `2px solid ${colors.divider}`,
    //       },
    //     },
    //   },
    // },
  },
};

export const theme = createTheme(themeOptions);

export default theme;
