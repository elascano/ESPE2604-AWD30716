const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Create a new product
router.post('/', productController.addProduct);

// Get all products and calculate total price
router.get('/', productController.getProducts);

// Find a product by name and return only its IVA amount
router.get('/:name/iva', productController.getProductIva);

// Find a product by name and compute expiration time
router.get('/:name/expiration', productController.getProductExpiration);

// Reset product list
router.post('/reset', productController.resetProducts);

module.exports = router;
