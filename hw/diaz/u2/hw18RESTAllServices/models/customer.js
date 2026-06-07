const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id: { type: Number },
    fullName: { type: String },
    email: { type: String },
    type: { type: String },
    discount: { type: Number },
    totalSale: { type: Number }
}, { collection: "Customers" });
module.exports = mongoose.model("Customer", customerSchema);