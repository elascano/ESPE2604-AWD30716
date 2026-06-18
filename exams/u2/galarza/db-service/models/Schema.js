const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        brand: { type: String },
        model: { type: String },
        price: { type: Number },
        date: { type: String, required: true },
        description: { type: String },
        isNew: { type: Boolean, required: true }
    },
    { 
        collection: process.env.ITEM_PLURAL,
        versionKey: false,
        suppressReservedKeysWarning: true
    }
);

module.exports = mongoose.model("Data", dataSchema);
