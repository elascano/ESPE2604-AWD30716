import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

try {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[service-crud] Persistence Service running on port ${PORT}`);
  });
} catch (error) {
  console.error('[service-crud] Error starting server:', error);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('[service-crud] Uncaught Exception:', err);
});
