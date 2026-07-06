import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import suppliesBusinessRoutes from './routes/suppliesBusinessRoutes';
import paymentsBusinessRoutes from './routes/paymentsBusinessRoutes';
import patientsBusinessRoutes from './routes/patientsBusinessRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

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

// ── Health check (público, para CloudFront) ───────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    status: 'ok',
    service: 'business-logic',
    timestamp: new Date().toISOString(),
  });
});

app.use('/fabuladental/auth', authRoutes);
app.use('/fabuladental/supplies', suppliesBusinessRoutes);
app.use('/fabuladental/payments', paymentsBusinessRoutes);
app.use('/fabuladental/patients', patientsBusinessRoutes);

app.listen(PORT, () => {
  console.log(`Business Logic running on port ${PORT}`);
});