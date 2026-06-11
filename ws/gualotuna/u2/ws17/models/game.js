const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema(
    {
        id: { type: Number },
        name: { type: String },
        description: { type: String },
        owner: { type: String },
        num_players: { type: Number },
        rank: { type: String },
        grading: { type: Number }
    },
    { collection: "Game" }
);

// Pre-save hook to calculate rank based on grading
gameSchema.pre('save', async function() {
    if (this.grading !== undefined && this.grading !== null) {
        if (this.grading >= 9) {
            this.rank = "Excellent";
        } else if (this.grading >= 7) {
            this.rank = "Good";
        } else if (this.grading >= 5) {
            this.rank = "Regular";
        } else {
            this.rank = "Low";
        }
    } else {
        this.rank = "Unranked";
    }
});

module.exports = mongoose.model("Game", gameSchema);