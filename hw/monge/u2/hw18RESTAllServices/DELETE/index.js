const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4004;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0";

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('DELETE Service connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error in DELETE Service:', err));

// Definición del esquema
const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  moneySpent: { type: Number, required: true }
}, { versionKey: false });

const Customer = mongoose.model('Customer', customerSchema, 'customers');

// Endpoint para eliminar un registro por su ID personalizado
app.delete('/computerstore/customer/:id', async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'El ID de la URL debe ser un número válido' });
    }

    // Buscar y eliminar físicamente
    const deletedCustomer = await Customer.findOneAndDelete({ id: customerId });

    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Cliente no encontrado para eliminar' });
    }

    res.json({ message: 'Registro eliminado con éxito', deleted: deletedCustomer });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`DELETE Service running on port ${PORT}`);
});