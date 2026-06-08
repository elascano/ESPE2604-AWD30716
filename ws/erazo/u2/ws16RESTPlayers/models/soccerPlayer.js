const mongoose = require("mongoose");

const soccerPlayerSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String }, 
    age: { type: Number },
    club: { type: String },
    position: { type: String },
  },
  {
    collection: "soccerPlayer",
    strict: false,
    timestamps: true
  }
);

module.exports = mongoose.model("soccerPlayer", soccerPlayerSchema);
