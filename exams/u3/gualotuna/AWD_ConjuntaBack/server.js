const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3009;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://Jennyfer:jennyfer@jennyfer.owlaicw.mongodb.net/product_db?retryWrites=true&w=majority';


app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend server is running cleanly',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/products', productRoutes);


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas database');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting Express server without MongoDB persistent storage...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server is running on http://0.0.0.0:${PORT} (Database Offline Mode)`);
    });
  });
