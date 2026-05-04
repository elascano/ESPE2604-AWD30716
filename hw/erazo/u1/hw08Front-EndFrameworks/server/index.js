import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appointmentRouter } from './appointmentRoutes.js';
import { connectDatabase } from './database.js';
import { seedAppointments } from './seedAppointments.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const clientDirectory = path.join(currentDirectory, '..', 'dist');

app.use(cors());
app.use(express.json());
app.use('/api/appointments', appointmentRouter);
app.use(express.static(clientDirectory));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(clientDirectory, 'index.html'));
});

const startServer = async () => {
  await connectDatabase();
  await seedAppointments();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
