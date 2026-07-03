import dotenv from 'dotenv';

dotenv.config();

import app from './app-business';

// Corre en el puerto 3001 por defecto para el servicio de reglas de negocio
const PORT = process.env.PORT_BUSINESS || process.env.PORT || 3001;

try {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Business Rules Service (Servicio A) is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting Business Rules Service:", error);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception (Business Rules Service):", err);
});
