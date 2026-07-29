import express from 'express';
import cors from 'cors';
import Config from './config';
import { connect } from './database';
import computationRoutes from './routes/computationRoutes';

const app = express();

app.use(cors({ origin: Config.corsOrigin === '*' ? '*' : [Config.corsOrigin, 'http://localhost:5173'], credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Backend API with MongoDB', timestamp: new Date().toISOString() });
});

app.use('/api', computationRoutes);

async function start(): Promise<void> {
  try {
    await connect();
  } catch (error: any) {
    console.error('[Backend] MongoDB connection failed, starting without database:', error.message);
  }

  app.listen(Config.port, () => {
    console.log(`[Backend] HTTP server running on port ${Config.port}`);
  });
}

start();