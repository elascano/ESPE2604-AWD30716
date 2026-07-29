import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976D2', light: '#42A5F5', dark: '#1565C0', contrastText: '#FFFFFF' },
    secondary: { main: '#9C27B0', light: '#BA68C8', dark: '#7B1FA2', contrastText: '#FFFFFF' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    success: { main: '#4CAF50' },
    error: { main: '#F44336' },
    warning: { main: '#FF9800' },
    info: { main: '#2196F3' },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: ['Roboto', '-apple-system', 'sans-serif'].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 16px' },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRight: 'none' },
      },
    },
  },
});

export { theme };
export default theme;
