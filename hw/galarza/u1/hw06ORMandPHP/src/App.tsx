/**
 * Componente Principal de la Aplicación
 * Basado en el documento de especificaciones técnicas
 */

import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './app/theme';
import { store } from './app/store';
import { router } from './app/router';

function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
