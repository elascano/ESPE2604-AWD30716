const ComputationsService = require('../services/ComputationsService');

const ComputationsController = {
  async cartTotal(req, res) {
    try {
      const { productIds } = req.body;
      const result = await ComputationsService.cartTotal(productIds);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async productIVA(req, res) {
    try {
      const result = await ComputationsService.productIVA(req.params.id);
      res.json(result);
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  async daysToExpire(req, res) {
    try {
      const { productId, day, month, year } = req.body;
      const result = await ComputationsService.daysToExpire({ productId, day, month, year });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = ComputationsController;
