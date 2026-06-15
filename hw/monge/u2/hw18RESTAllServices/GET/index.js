const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('GET Service connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error in GET Service:', err));

// Definición del esquema
const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  moneySpent: { type: Number, required: true }
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema, 'customers');

// Endpoint para obtener todas las personas (clientes)
app.get('/computerstore/customer', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los registros: ' + error.message });
  }
});

// Endpoint para obtener una persona (cliente) por su identificador único personalizado 'id'
app.get('/computerstore/customer/:id', async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el registro: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`GET Service running on port ${PORT}`);
});

