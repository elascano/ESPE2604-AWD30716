const mongoose = require("mongoose");

const danceItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "Standard"
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: "DanceItems"
  }
);

module.exports = mongoose.model("DanceItem", danceItemSchema);
