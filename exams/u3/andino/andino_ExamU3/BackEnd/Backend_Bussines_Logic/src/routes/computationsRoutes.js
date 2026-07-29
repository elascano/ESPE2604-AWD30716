const express = require('express');
const router = express.Router();
const ComputationsController = require('../controllers/ComputationsController');

router.post('/cart-total', ComputationsController.cartTotal);
router.get('/product-iva/:id', ComputationsController.productIVA);
router.post('/days-to-expire', ComputationsController.daysToExpire);

module.exports = router;
