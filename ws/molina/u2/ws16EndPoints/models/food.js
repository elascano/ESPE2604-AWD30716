const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: {
            type: String
        },
        category: {
            type: String
        },
        description: {
            type: String
        },
        price: {
            type: Number
        },
        currency: {
            type: String
        },
        calories: {
            type: Number
        },
        ingredients: {
            type: [String]
        },
        allergens: {
            type: [String]
        },
        isVegetarian: {
            type: Boolean
        },
        isVegan: {
            type: Boolean
        },
        spicyLevel: {
            type: Number
        },
        preparationTimeMinutes: {
            type: Number
        },
        available: {
            type: Boolean
        },
        rating: {
            type: Number
        },
        imageUrl: {
            type: String
        }
    },
    {
        collection: 'Food'
    }
);

module.exports = mongoose.model('Food', foodSchema);