const mongoose = require('mongoose');

const videogameSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    launchdate: {
        type: String,
        required: false
    },
    genre: {
        type: String,
        required: true
    }
},
    {collection: 'Videogame'}
);
module.exports = mongoose.model('Videogame', videogameSchema);