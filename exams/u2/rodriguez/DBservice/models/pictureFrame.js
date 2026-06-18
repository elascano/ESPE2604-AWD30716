const mongoose = require("mongoose");

const pictureFrameSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: false },
  serial: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  date: { type: String, required: true },
  price: { type: Number, required: true },
  pice_time: { type: Number, required: false },
  description: { type: String, required: false },
  is_new: { type: Boolean, required: true }
}, { collection: "picture_frames" });

module.exports = mongoose.model("PictureFrame", pictureFrameSchema);
