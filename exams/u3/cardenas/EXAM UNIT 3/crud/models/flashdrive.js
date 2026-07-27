const mongoose = require('mongoose');

const flashdriveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,        
    },
    expiration_date: {
        type: Date,
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