const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  expiration_day: { type: Number, required: true },
  expiration_month: { type: Number, required: true },
  expiration_year: { type: Number, required: true },
  iva_amount: { type: Number, required: false },
  days_left: { type: Number, required: false }
}, { collection: "products" });

module.exports = mongoose.model("Product", productSchema);
