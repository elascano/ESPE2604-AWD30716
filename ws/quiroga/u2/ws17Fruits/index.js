const port = process.env.PORT || 3013;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fruitRoutes = require('./routes/fruitRoutes');

mongoose.connect("mongodb+srv://admin:admin@cluster0.2rrkifc.mongodb.net/Fruits?appName=Cluster0")

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Esteban's system connected to MongoDB"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rutas API
app.use("/fruitstore", fruitRoutes);

// Servir el archivo HTML principal en la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Esteban's Fruit Store server is running on port ${port}`);
});

