const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4002;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('POST Service connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error in POST Service:', err));

// Definición del esquema
const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  moneySpent: { type: Number, required: true }
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema, 'customers');

// Endpoint para guardar un nuevo registro
app.post('/computerstore/customer', async (req, res) => {
  try {
    const { id, name, age, moneySpent } = req.body;

    // Validaciones básicas
    if (id === undefined || name === undefined || age === undefined || moneySpent === undefined) {
      return res.status(400).json({ error: 'Todos los campos (id, name, age, moneySpent) son requeridos' });
    }

    const customerId = Number(id);
    const customerAge = Number(age);
    const customerMoney = Number(moneySpent);

    if (isNaN(customerId) || !Number.isInteger(customerId)) {
      return res.status(400).json({ error: 'El ID debe ser un número entero válido' });
    }

    if (isNaN(customerAge) || !Number.isInteger(customerAge)) {
      return res.status(400).json({ error: 'La edad debe ser un número entero válido' });
    }

    if (isNaN(customerMoney)) {
      return res.status(400).json({ error: 'El dinero gastado debe ser un número decimal válido' });
    }

    // Verificar si ya existe el ID único
    const existing = await Customer.findOne({ id: customerId });
    if (existing) {
      return res.status(400).json({ error: `El registro con ID ${customerId} ya existe` });
    }

    // Crear y guardar
    const newCustomer = new Customer({
      id: customerId,
      name,
      age: customerAge,
      moneySpent: customerMoney
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el registro: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`POST Service running on port ${PORT}`);
});

