const mongoose = require('mongoose');

// The cart holds an array of product-like objects.
// Keeping a small copy of each product's data here means the total can
// still be recomputed even if the original product changes price later.
const cartSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      vatRate: Number,
      image: String
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
