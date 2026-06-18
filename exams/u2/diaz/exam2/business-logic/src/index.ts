import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import soundmixersBusinessRoutes from './routes/soundmixersBusinessRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// POST /store  — business logic entry point
app.use('/store', soundmixersBusinessRoutes);

app.listen(PORT, () => {
  console.log(`[Business Logic] Server running on port ${PORT}`);
  console.log(`[Business Logic] CRUD target: http://${process.env.CRUD_API_IP}:3000/store`);
});