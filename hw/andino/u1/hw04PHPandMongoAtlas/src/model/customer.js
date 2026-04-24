const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  names: { type: String, required: true },
  surnames: { type: String, required: true },
  birth_date: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  cellphone: { type: String, required: true },
});

module.exports = mongoose.model('Customer', CustomerSchema);
