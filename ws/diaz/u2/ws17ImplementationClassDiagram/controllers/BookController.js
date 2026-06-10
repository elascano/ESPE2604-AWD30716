const Book = require("../models/Books");
const BookService = require("../services/BookService");

async function createBook(bookData) {
    return await Book.create(bookData);
}

async function getAllBooks() {
    return await Book.find();
}

async function getBookById(id) {
    return await Book.findOne({ id: Number(id) });
}

async function getBooksWithTax() {
    const books = await getAllBooks();
    return await Promise.all(books.map((book) => BookService.applyBookTax(book)));
}

async function getAverageRating() {
    return await BookService.calculateAverageBookRating();
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    getBooksWithTax,
    getAverageRating,
};