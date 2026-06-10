const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    id:       { type: Number },
    director: { type: String },
    gender:   { type: String },
    title:    { type: String },
  },
  { collection: "Movie", strict: false }
);

module.exports = mongoose.model("Movie", movieSchema);
