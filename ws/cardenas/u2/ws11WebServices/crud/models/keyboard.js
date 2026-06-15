const mongoose = require('mongoose');

const keyboardSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,        
    },
    model_name: {
        type: String,
        required: false
    },
    release_date: {
        type: Date,
        required: false
    },
    price_usd: {
        type: Number,
        required: false
    },
    is_mechanical: {
        type: Boolean,
        required: false
    },
    warranty_months: {
        type: Number,
        required: false
    },
    features_list: {
        type: Array,
        required: false
    }
},
    {collection: 'Keyboards'}
);
module.exports = mongoose.model('Keyboard', keyboardSchema);