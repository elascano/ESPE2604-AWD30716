const mongoose = require('mongoose');

const flashdriveSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,        
    },
    brand: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: false
    },
    elaborationDate: {
        type: Date,
        required: false
    },
    lifeYears: {
        type: Number,
        required: false
    },
    new: {
        type: Boolean,
        required: false
    },
    price: {
        type: Number,
        required: false
    }
},
    {collection: 'FlashDrives'}
);
module.exports = mongoose.model('FlashDrive', flashdriveSchema);