const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4003;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('PUT Service connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error in PUT Service:', err));

// Definición del esquema
const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  moneySpent: { type: Number, required: true }
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema, 'customers');

// Endpoint para actualizar un registro por su ID personalizado
app.put('/computerstore/customer/:id', async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'El ID de la URL debe ser un número válido' });
    }

    const { name, age, moneySpent } = req.body;
    const updateFields = {};

    if (name !== undefined) {
      updateFields.name = name;
    }

    if (age !== undefined) {
      const customerAge = Number(age);
      if (isNaN(customerAge) || !Number.isInteger(customerAge)) {
        return res.status(400).json({ error: 'La edad debe ser un número entero válido' });
      }
      updateFields.age = customerAge;
    }

    if (moneySpent !== undefined) {
      const customerMoney = Number(moneySpent);
      if (isNaN(customerMoney)) {
        return res.status(400).json({ error: 'El dinero gastado debe ser un número decimal válido' });
      }
      updateFields.moneySpent = customerMoney;
    }

    // Buscar y actualizar
    const updatedCustomer = await Customer.findOneAndUpdate(
      { id: customerId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Cliente no encontrado para actualizar' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el registro: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PUT Service running on port ${PORT}`);
});

