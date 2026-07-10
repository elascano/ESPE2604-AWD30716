import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});
