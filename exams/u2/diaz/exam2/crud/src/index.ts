import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import soundmixerRouter from './routes/soundmixerRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.set('json replacer', (key: string, value: any) => {
  return typeof value === 'bigint' ? value.toString() : value;
});

app.use(cors());
app.use(express.json());

app.use('/store', soundmixerRouter);

app.listen(port, () => {
  console.log(`Store CRUD Server running on port ${port}`);
});
