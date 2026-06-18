const mongoose = require('mongoose');

const maskSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
  },
  { collection: 'Masks' }
);

module.exports = mongoose.model('Mask', maskSchema);