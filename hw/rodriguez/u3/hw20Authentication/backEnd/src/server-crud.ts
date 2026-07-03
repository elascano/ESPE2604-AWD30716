import dotenv from 'dotenv';

dotenv.config();

import app from './app';

// Corre en el puerto 3000 por defecto para el servicio CRUD (Servicio B)
const PORT = process.env.PORT || 3000;

try {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CRUD Service (Servicio B) is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting CRUD Service:", error);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception (CRUD Service):", err);
});
