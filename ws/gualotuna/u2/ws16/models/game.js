const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema(
    {
        name: { type: String },
        owner: { type: String },
        age: { type: Number },
        genre: { type: String },
        platforms: { type: [String] },
        multiplayer: { type: Boolean }
    },
    { collection: "Game" }
);

module.exports = mongoose.model("Game", gameSchema);