const mongoose = require('mongoose');

const PencilSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  hardness: { type: String, required: true },
  length: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  manufacturer: { type: String, required: true },
}, { collection: 'pencils' });

module.exports = mongoose.model('Pencil', PencilSchema);
