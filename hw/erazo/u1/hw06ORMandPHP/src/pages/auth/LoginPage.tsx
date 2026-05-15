/**
 * Página de Login
 * Basada en el documento de especificaciones técnicas
 */

import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación con Zod
const loginSchema = z.object({
  cedula: z.string()
    .min(1, 'La cédula es requerida')
    .refine((val) => {
      // Permitir "admin" o cédulas válidas (10-13 dígitos)
      if (val === 'admin') return true;
      return val.length >= 10 && val.length <= 13;
    }, 'La cédula debe tener al menos 10 dígitos'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await login({
        cedula: data.cedula,
        password: data.password,
      });

      if (result.success) {
        // Redirigir según el rol
        navigate('/dashboard');
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo y título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HospitalIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              SER SALUD
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic', mt: 1 }}
            >
              "Lo importante no es poder, lo importante es intentar"
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Número de Cédula"
              placeholder="Ingresa tu cédula"
              {...register('cedula')}
              error={!!errors.cedula}
              helperText={errors.cedula?.message}
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ fontWeight: 600 }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </form>

          {/* Credenciales de prueba */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom fontWeight="bold">
              Credenciales de prueba:
            </Typography>
            <Typography variant="caption" display="block">
              Paciente: 1234567890 / password123
            </Typography>
            <Typography variant="caption" display="block">
              Admin: admin / admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
