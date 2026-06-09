const express = require("express");
const Book = require("../models/Books");
const router = express.Router();

// GET all books
router.get("/books", async(req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;

