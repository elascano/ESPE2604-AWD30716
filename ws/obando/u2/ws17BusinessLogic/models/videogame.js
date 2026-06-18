const mongoose = require('mongoose');

const videogameSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    launchDate: { type: String, required: false },
    hoursGame: { type: Number, required: true },
    platform: { type: String, required: true },
    genre: { type: String, required: true }
}, {
    collection: 'videogames', 
    timestamps: true
});

module.exports = mongoose.model('Videogame', videogameSchema);