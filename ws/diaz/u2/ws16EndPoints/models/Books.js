const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: { type: Number },
    name_book: { type: String },
    author: { type: String }
}, { collection: "Books" });
module.exports = mongoose.model("Books", bookSchema);