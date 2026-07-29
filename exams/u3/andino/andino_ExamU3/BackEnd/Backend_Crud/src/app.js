const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/shopDavid/products', productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CRUD API running' });
});

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CRUD] Server running on http://localhost:${PORT}`);
  });
});
