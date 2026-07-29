const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  expirationDay: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },
  expirationMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  expirationYear: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'storeDavid');
