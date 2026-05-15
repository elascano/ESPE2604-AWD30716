/**
 * Página de Registro
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
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LocalHospital as HospitalIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema de validación con Zod
const registerSchema = z.object({
  nombresCompletos: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  cedula: z.string()
    .min(10, 'La cédula debe tener al menos 10 dígitos')
    .max(13, 'La cédula no puede tener más de 13 dígitos'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  direccion: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  edad: z.number()
    .min(1, 'La edad debe ser mayor a 0')
    .max(120, 'La edad no puede ser mayor a 120'),
  sexo: z.enum(['masculino', 'femenino', 'otro']),
  tipoSeguro: z.enum(['ninguno', 'iess', 'ejercito', 'policia', 'privado', 'issfa', 'isspol']),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipoSeguro: 'ninguno',
      sexo: 'masculino',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await registerUser({
        nombresCompletos: data.nombresCompletos,
        cedula: data.cedula,
        password: data.password,
        direccion: data.direccion,
        edad: data.edad,
        sexo: data.sexo,
        tipoSeguro: data.tipoSeguro,
        telefono: data.telefono,
        email: data.email,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Error al registrar usuario');
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
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo y título */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <HospitalIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Registro de Paciente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa el formulario para crear tu cuenta
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombres Completos"
                  placeholder="Ej: Juan Pérez García"
                  {...register('nombresCompletos')}
                  error={!!errors.nombresCompletos}
                  helperText={errors.nombresCompletos?.message}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número de Cédula"
                  placeholder="1234567890"
                  {...register('cedula')}
                  error={!!errors.cedula}
                  helperText={errors.cedula?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="edad"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Edad"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      error={!!errors.edad}
                      helperText={errors.edad?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Sexo"
                  {...register('sexo')}
                  error={!!errors.sexo}
                  helperText={errors.sexo?.message}
                  defaultValue="masculino"
                >
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  placeholder="0999123456"
                  {...register('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  placeholder="Av. Principal 123, Ciudad"
                  {...register('direccion')}
                  error={!!errors.direccion}
                  helperText={errors.direccion?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email (opcional)"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Seguro"
                  {...register('tipoSeguro')}
                  error={!!errors.tipoSeguro}
                  helperText={errors.tipoSeguro?.message}
                  defaultValue="ninguno"
                >
                  <MenuItem value="ninguno">No tengo seguro</MenuItem>
                  <MenuItem value="iess">Seguro IESS</MenuItem>
                  <MenuItem value="ejercito">Seguro del Ejército</MenuItem>
                  <MenuItem value="policia">Seguro Policial</MenuItem>
                  <MenuItem value="issfa">ISSFA (Instituto de Seguridad Social de las Fuerzas Armadas)</MenuItem>
                  <MenuItem value="isspol">ISSPOL (Instituto de Seguridad Social de la Policía)</MenuItem>
                  <MenuItem value="privado">Seguro Privado</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600,
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Volver al inicio de sesión
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
