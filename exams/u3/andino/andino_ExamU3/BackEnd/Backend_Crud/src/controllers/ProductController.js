const ProductService = require('../services/ProductService');

const ProductController = {
  async getAll(req, res) {
    try {
      const products = await ProductService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const product = await ProductService.remove(req.params.id);
      res.json({ message: 'Product deleted', product });
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
