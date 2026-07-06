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

// ── Cache-Control middleware ───────────────────────────────────────────────────
// GETs: CloudFront puede cachear 60 s; mutaciones nunca se cachean
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// ── Health check (público, sin API key, para CloudFront) ──────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    status: 'ok',
    service: 'crud',
    timestamp: new Date().toISOString(),
  });
});

// ── API key middleware (protege el resto de rutas) ────────────────────────────
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