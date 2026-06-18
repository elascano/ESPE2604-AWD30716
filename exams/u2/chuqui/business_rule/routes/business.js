const express = require('express');
const router = express.Router();
const axios = require('axios');

const CRUD_SERVICE_URL = process.env.CRUD_SERVICE_URL || 'http://examenunit21chuqui-env.eba-k3bcwmzq.us-east-2.elasticbeanstalk.com/api/pencils';

router.get('/calculate-price/:serial_number', async (req, res) => {
    try {
        const { serial_number } = req.params;

        let productResponse;
        try {
            productResponse = await axios.get(`${CRUD_SERVICE_URL}/${serial_number}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ message: 'Product not found in CRUD service' });
            }
            throw error;
        }

        const product = productResponse.data;


        let finalPrice = product.price;
        let appliedRule = '';

        if (!product.is_new) {
            finalPrice = product.price * 0.80;
            appliedRule = '20% discount applied for non-new item';
        } else {
            finalPrice = product.price * 1.12;
            appliedRule = '12% tax applied for new item';
        }

        res.json({
            message: 'Price calculated successfully based on business rules',
            serial_number: product.serial_number,
            brand: product.brand,
            model: product.model,
            is_new: product.is_new,
            original_price: product.price,
            final_calculated_price: finalPrice,
            business_rule_applied: appliedRule
        });

    } catch (error) {
        console.error('Error calculating price:', error.message);
        res.status(500).json({ message: 'Server error in business rule', error: error.message });
    }
});

module.exports = router;
