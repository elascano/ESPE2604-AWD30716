const Book = require("../models/Books");

async function applyBookTax(book) {
    const source = book.toObject ? book.toObject() : book;
    const price = typeof source.price === "number" ? source.price : Number(source.price) || 0;
    return {
        ...source,
        price_final: Number((price * 1.15).toFixed(2)),
        iva_percentage: 15,
    };
}

async function calculateAverageBookRating() {
    const result = await Book.aggregate([{
        $group: {
            _id: null,
            promedio: { $avg: "$review_score" },
        },
    }, ]);

    const promedio = result[0] ? result[0].promedio : 0;
    return Number((promedio || 0).toFixed(2));
}

module.exports = {
    applyBookTax,
    calculateAverageBookRating,
};