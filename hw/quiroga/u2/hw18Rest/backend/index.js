require('dotenv').config();

const port = process.env.PORT || 3013;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');

const mongoUri = process.env.MONGO_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

mongoose.connect(mongoUri)

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Esteban's system connected to MongoDB"));

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/computerstore", customerRoutes);


app.listen(port, () => {
    console.log(`Esteban's Computer Store server is running on port ${port}`);
});

