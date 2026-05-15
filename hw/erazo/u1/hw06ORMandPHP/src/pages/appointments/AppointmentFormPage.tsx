/**
 * Página de Formulario de Cita
 * Paso 2: Formulario con síntomas y exámenes
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTES } from '../../app/router';

const formSchema = z.object({
  sintomas: z.string().min(10, 'Describe tus síntomas (mínimo 10 caracteres)'),
  tieneExamenes: z.enum(['si', 'no']),
});

type FormData = z.infer<typeof formSchema>;

export default function AppointmentFormPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tieneExamenes: 'no',
    },
  });

  const tieneExamenes = watch('tieneExamenes');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    // Guardar datos del formulario
    const appointmentData = JSON.parse(sessionStorage.getItem('appointmentData') || '{}');
    
    sessionStorage.setItem('appointmentData', JSON.stringify({
      ...appointmentData,
      sintomas: data.sintomas,
      tieneExamenes: data.tieneExamenes === 'si',
      examenes: files.map(f => f.name),
    }));

    navigate(ROUTES.CONFIRMACION);
  };

  // Verificar que existan datos previos
  const appointmentData = sessionStorage.getItem('appointmentData');
  if (!appointmentData) {
    return (
      <Box>
        <Alert severity="error">
          No se encontraron datos de la cita. Por favor, inicia el proceso desde el principio.
        </Alert>
        <Button onClick={() => navigate(ROUTES.TERAPIAS)} sx={{ mt: 2 }}>
          Volver a Terapias
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.CALENDARIO)}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Información Médica
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Completa el formulario para tu cita
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            {/* Síntomas */}
            <TextField
              fullWidth
              label="Describe tus síntomas"
              placeholder="Ej: Dolor en la rodilla derecha al caminar..."
              multiline
              rows={4}
              {...register('sintomas')}
              error={!!errors.sintomas}
              helperText={errors.sintomas?.message}
              sx={{ mb: 3 }}
            />

            {/* ¿Tiene exámenes? */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">¿Tienes exámenes médicos?</FormLabel>
              <Controller
                name="tieneExamenes"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {/* Upload de archivos */}
            {tieneExamenes === 'si' && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Subir Exámenes
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                </Button>

                {files.length > 0 && (
                  <List>
                    {files.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                <Alert severity="info" sx={{ mt: 2 }}>
                  Si no los tienes en digital, no olvides llevarlos el día de tu cita
                </Alert>
              </Box>
            )}

            {/* Botón continuar */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 3 }}
            >
              Continuar a Confirmación
            </Button>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
