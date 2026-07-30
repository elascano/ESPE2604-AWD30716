const express = require('express');
const router = express.Router();
const {
  computeCartTotal,
  computeProductIVA,
  computeExpirationDays,
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} = require('../controllers/productController');


router.post('/cart-total', computeCartTotal);
router.post('/compute-iva', computeProductIVA);
router.post('/compute-expiration', computeExpirationDays);


router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

module.exports = router;
