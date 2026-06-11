const Fruit = require('../models/fruit');

class FruitController {

    static async createFruit(req, res) {
        try {
            const newFruit = new Fruit(req.body);
            const savedFruit = await newFruit.save();

            res.status(201).json(savedFruit);
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    static async getAllFruits(req, res) {
        try {
            const fruits = await Fruit.find();

            res.status(200).json(fruits);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    static async getFruitsByCategory(req, res) {
        try {
            const fruits = await Fruit.find({
                category: req.params.category
            });

            if (fruits.length === 0) {
                return res.status(404).json({
                    message: 'No fruits found'
                });
            }

            res.status(200).json(fruits);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    static async calculateEarnings(req, res) {
        try {
            const { id } = req.params;

            const fruit = await Fruit.findOne({
                id: Number(id)
            });

            if (!fruit) {
                return res.status(404).json({
                    message: 'Fruit not found'
                });
            }

            fruit.earnings = fruit.sellPrice - fruit.buyPrice;
            fruit.earnings = parseFloat(fruit.earnings.toFixed(2));

            await fruit.save();

            res.status(200).json(fruit);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }


    static async getTotalEarnings(req, res) {
        try {
            const fruits = await Fruit.find();
            const totalEarnings = fruits.reduce((total, fruit) => {
                return total + (fruit.earnings || 0);
            }, 0);

            res.status(200).json({
                totalEarnings: parseFloat(totalEarnings.toFixed(2))
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = FruitController;