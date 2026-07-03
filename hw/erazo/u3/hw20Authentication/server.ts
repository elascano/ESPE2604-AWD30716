import express from 'express';
import authRoutes from './hw20Authentication';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Ser Salud Physical Therapy API running on port ${PORT}`);
});
