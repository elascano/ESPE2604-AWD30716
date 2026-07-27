const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    dateExpiration: {
        type: Date,
        required: true
    },
    daysExpiration: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
