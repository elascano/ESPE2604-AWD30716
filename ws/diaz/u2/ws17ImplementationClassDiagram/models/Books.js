const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: { type: Number },
    name_book: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    price: { type: Number, default: 0 },
    review_score: { type: Number, default: 0 },
}, { collection: "Books" });
module.exports = mongoose.model("Books", bookSchema);