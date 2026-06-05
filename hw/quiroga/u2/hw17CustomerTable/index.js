const port = 3013;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');

mongoose.connect("mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0")

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Esteban's system connected to MongoDB"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rutas API
app.use("/computerstore", customerRoutes);

// Servir el archivo HTML principal en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Esteban's Computer Store server is running on port ${port}`);
});

