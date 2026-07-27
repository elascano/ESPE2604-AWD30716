const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/total', productController.computeTotal);
router.post('/iva', productController.computeIVA);
router.post('/expiration', productController.computeExpiration);

module.exports = router;
