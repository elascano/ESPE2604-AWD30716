import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './app/theme';
import NavBar from './components/NavBar';
import TotalCalculationPage from './pages/TotalCalculationPage';
import IvaCalculationPage from './pages/IvaCalculationPage';
import ExpirationCalculationPage from './pages/ExpirationCalculationPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <NavBar />
          <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/total-calculation" replace />} />
              <Route path="/total-calculation" element={<TotalCalculationPage />} />
              <Route path="/iva-calculation" element={<IvaCalculationPage />} />
              <Route path="/expiration-calculation" element={<ExpirationCalculationPage />} />
              <Route path="*" element={<Navigate to="/total-calculation" replace />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
