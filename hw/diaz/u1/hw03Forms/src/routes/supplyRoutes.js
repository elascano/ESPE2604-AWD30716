const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');

router.post('/', supplyController.createSupply);
router.get('/', supplyController.getSupplies);

module.exports = router;
