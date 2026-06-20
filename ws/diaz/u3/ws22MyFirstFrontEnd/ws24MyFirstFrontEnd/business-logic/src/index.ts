import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import suppliesBusinessRoutes from './routes/suppliesBusinessRoutes';
import paymentsBusinessRoutes from './routes/paymentsBusinessRoutes';
import patientsBusinessRoutes from './routes/patientsBusinessRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/fabuladental/supplies', suppliesBusinessRoutes);
app.use('/fabuladental/payments', paymentsBusinessRoutes);
app.use('/fabuladental/patients', patientsBusinessRoutes);

app.listen(PORT, () => {
  console.log(`Business Logic running`);
});