const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
  },
  { collection: "Song" }
);

module.exports = mongoose.model("Song", songSchema);
