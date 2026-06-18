import serverless from 'serverless-http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import soundmixerRouter from './routes/soundmixerRoutes';

const app = express();

app.set('json replacer', (key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value;
});

app.use(cors());
app.use(express.json());

app.use('/store', soundmixerRouter);

// For local development
if (process.env.IS_LOCAL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`[CRUD] Running locally on port ${port}`);
  });
}

// Lambda handler export
export const handler = serverless(app);
