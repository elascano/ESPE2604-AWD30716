const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id: { type: Number },
    fullName: { type: String },
    name: { type: String },
    email: { type: String },
    type: { type: String },
    discount: { type: Number },
    totalSale: { type: Number },
    moneySpent: { type: Number }
}, { collection: "Customer" });
module.exports = mongoose.model("Customer", customerSchema);