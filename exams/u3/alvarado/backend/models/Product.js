const mongoose = require('mongoose');

// Each product is an object with the fields below.
// "image" holds a URL, so the picture itself is not stored in the DB,
// only the link to it (as requested).
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vatRate: { type: Number, required: true }, // e.g. 0.15 = 15% VAT (IVA)
  image: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
