const express = require('express');
const router = express.Router();
const {
    getCatalog,
    createProduct,
    calculateCartTotal,
    calculateIva,
    calculateExpiration
} = require('../controllers/productController');

router.get('/', getCatalog);
router.post('/', createProduct);
router.post('/cart-total', calculateCartTotal);
router.post('/iva', calculateIva);
router.post('/expiration', calculateExpiration);

module.exports = router;
