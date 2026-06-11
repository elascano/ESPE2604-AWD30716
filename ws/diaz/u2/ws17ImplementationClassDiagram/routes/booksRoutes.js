const express = require("express");
const BookController = require("../controllers/BookController");
const router = express.Router();

// GET all books
router.get("/books", async(req, res) => {
    try {
        const books = await BookController.getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all books with final price including 15% IVA
router.get("/books/with-tax", async(req, res) => {
    try {
        const booksWithTax = await BookController.getBooksWithTax();
        res.json(booksWithTax);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET average review score for all books
router.get("/books/average-rating", async(req, res) => {
    try {
        const averageReviewScore = await BookController.getAverageRating();
        res.json({ average_review_score: averageReviewScore });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single book by id
router.get("/books/:id", async(req, res) => {
    try {
        const book = await BookController.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;