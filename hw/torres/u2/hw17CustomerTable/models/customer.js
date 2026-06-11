const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: false
    },
    moneySpent: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    collection: "Customer"
  }
);

module.exports = mongoose.model("Customer", customerSchema);
