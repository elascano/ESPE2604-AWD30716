const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    // Nuevos campos para la lógica de negocio
    stock: { type: Number, required: true },
    minStock: { type: Number, required: true },
    expirationDate: { type: Date, required: true }
}, { collection: "Medicines" });

module.exports = mongoose.model("Medicine", medicineSchema);