const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    ivaRate: {
      type: Number,
      default: 19, 
      min: [0, 'IVA rate cannot be negative'],
    },
    expirationDay: {
      type: Number,
      required: [true, 'Expiration day is required'],
      min: 1,
      max: 31,
    },
    expirationMonth: {
      type: Number,
      required: [true, 'Expiration month is required'],
      min: 1,
      max: 12,
    },
    expirationYear: {
      type: Number,
      required: [true, 'Expiration year is required'],
      min: 2024,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
