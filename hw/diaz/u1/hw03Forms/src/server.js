const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('./utils/database');

const patientRoutes = require('./routes/patientRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supplyRoutes = require('./routes/supplyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/', express.static(path.join(__dirname, 'views'))); // Serving views as root as well for convenience

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/supplies', supplyRoutes);

// General route to serve index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server and connect to MongoDB
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});
