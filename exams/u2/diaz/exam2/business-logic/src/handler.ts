import serverless from 'serverless-http';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import soundmixersBusinessRoutes from './routes/soundmixersBusinessRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/store', soundmixersBusinessRoutes);

// For local development
if (process.env.IS_LOCAL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`[Business Logic] Running locally on port ${PORT}`);
    console.log(`[Business Logic] CRUD target: http://${process.env.CRUD_API_URL}`);
  });
}

// Lambda handler export
export const handler = serverless(app);
