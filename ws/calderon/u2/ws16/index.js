// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cellphoneRoutes = require('./routes/cellphoneRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cellphones', cellphoneRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});