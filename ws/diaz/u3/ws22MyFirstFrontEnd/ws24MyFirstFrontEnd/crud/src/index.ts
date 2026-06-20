import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import supplyRouter from './routes/supplyRoutes';
import patientRouter from './routes/patientRoutes';
import paymentRouter from './routes/paymentRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.set('json replacer', (key: string, value: any) => {
  return typeof value === 'bigint' ? value.toString() : value;
});

app.use(cors());
app.use(express.json());

app.use('/fabuladental', supplyRouter);
app.use('/fabuladental', patientRouter);
app.use('/fabuladental', paymentRouter);

app.listen(port, () => {
  console.log(`Fábula Dental CRUD Server running on port ${port}`);
});
