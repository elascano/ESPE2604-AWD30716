import app from './app';
import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // Cualquier ruta no reconocida por la API se pasa a Vue Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});