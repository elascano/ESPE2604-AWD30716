const mongoose = require('mongoose');

const PencilSchema = new mongoose.Schema({
  serial_number: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  is_new: { type: Boolean, required: true },
  price: { type: Number, required: true, min: 0 }
}, { collection: 'pencils' });

module.exports = mongoose.model('Pencil', PencilSchema);
