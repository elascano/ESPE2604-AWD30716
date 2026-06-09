const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    category: { type: String },
    price: { type: Number }
}, { collection: "Medicines" });

module.exports = mongoose.model("Medicine", medicineSchema);