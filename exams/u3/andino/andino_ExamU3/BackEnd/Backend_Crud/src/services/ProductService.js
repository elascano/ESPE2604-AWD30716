const Product = require('../models/Product');

const ProductService = {
  async getAll() {
    return await Product.find().sort({ createdAt: -1 });
  },

  async getById(id) {
    return await Product.findById(id);
  },

  async create(data) {
    if (!data.name || data.name.trim() === '') throw new Error('Product name is required');
    if (data.price == null || isNaN(data.price)) throw new Error('Valid price is required');
    if (!data.category || data.category.trim() === '') throw new Error('Category is required');
    if (data.expirationDay == null || data.expirationMonth == null || data.expirationYear == null) {
      throw new Error('Expiration date (day, month, year) is required');
    }

    return await Product.create({
      name: data.name.trim(),
      description: data.description || '',
      price: parseFloat(data.price),
      category: data.category.trim(),
      expirationDay: parseInt(data.expirationDay),
      expirationMonth: parseInt(data.expirationMonth),
      expirationYear: parseInt(data.expirationYear),
    });
  },

  async update(id, data) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    if (data.name) product.name = data.name.trim();
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = parseFloat(data.price);
    if (data.category) product.category = data.category.trim();
    if (data.expirationDay !== undefined) product.expirationDay = parseInt(data.expirationDay);
    if (data.expirationMonth !== undefined) product.expirationMonth = parseInt(data.expirationMonth);
    if (data.expirationYear !== undefined) product.expirationYear = parseInt(data.expirationYear);

    await product.save();
    return product;
  },

  async remove(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    await Product.findByIdAndDelete(id);
    return product;
  },
};

module.exports = ProductService;
