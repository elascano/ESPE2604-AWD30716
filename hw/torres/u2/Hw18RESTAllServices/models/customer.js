const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 0
    },
    moneySpent: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    collection: "Customer"
  }
);

module.exports = mongoose.model("Customer", customerSchema);
