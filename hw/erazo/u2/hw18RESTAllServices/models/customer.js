const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String },
    fullName: { type: String },
    email: { type: String },
    age: { type: Number },
    type: { type: String },
    discount: { type: Number },
    moneySpent: { type: Number },
    totalSale: { type: Number }
  },
  {
    collection: "Customer",
    strict: false,
    timestamps: true
  }
);

module.exports = mongoose.model("Customer", customerSchema);
