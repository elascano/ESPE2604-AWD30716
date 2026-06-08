const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    moneySpent: {
        type: Number,
        required: false
    }
},
    {collection: 'Customer'}
);
module.exports = mongoose.model('Customer', customerSchema);