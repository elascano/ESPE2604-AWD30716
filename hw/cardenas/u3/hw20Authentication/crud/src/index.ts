import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import supplyRouter from './routes/supplyRoutes';
import patientRouter from './routes/patientRoutes';
import paymentRouter from './routes/paymentRoutes';
import userRouter from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.set('json replacer', (key: string, value: any) => {
  return typeof value === 'bigint' ? value.toString() : value;
});

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CRUD_API_KEY) {
    return res.status(401).json({ error: "Authentication failure" });
  }
  return next();
});

app.use('/fabuladental', supplyRouter);
app.use('/fabuladental', patientRouter);
app.use('/fabuladental', paymentRouter);
app.use('/fabuladental', userRouter);

app.listen(port, () => {
  console.log(`Fábula Dental CRUD Server running on port ${port}`);
});