const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    vatRate: {
        type: Number,
        default: 21
    },
    expiration: {
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true }
    }

}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
