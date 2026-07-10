import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import suppliesBusinessRoutes from './routes/suppliesBusinessRoutes';
import paymentsBusinessRoutes from './routes/paymentsBusinessRoutes';
import patientsBusinessRoutes from './routes/patientsBusinessRoutes';
import authRoutes from './routes/authRoutes';
import healthRouter from './routes/health.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRouter);
app.use('/fabuladental/auth', authRoutes);
app.use('/fabuladental/supplies', suppliesBusinessRoutes);
app.use('/fabuladental/payments', paymentsBusinessRoutes);
app.use('/fabuladental/patients', patientsBusinessRoutes);

export default app;