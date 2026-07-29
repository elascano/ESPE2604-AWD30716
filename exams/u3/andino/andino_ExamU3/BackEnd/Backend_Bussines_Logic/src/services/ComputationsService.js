const axios = require('axios');

const CRUD_API = process.env.CRUD_API_URL;
const IVA_PERCENTAGE = parseFloat(process.env.IVA_PERCENTAGE || '15');

async function fetchProduct(id) {
  const { data } = await axios.get(`${CRUD_API}/products/${id}`);
  return data;
}

async function fetchProductsByIds(ids) {
  const promises = ids.map(id => axios.get(`${CRUD_API}/products/${id}`).then(r => r.data));
  return Promise.all(promises);
}

const ComputationsService = {
  async cartTotal(productIds) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('An array of product IDs is required');
    }

    const products = await fetchProductsByIds(productIds);
    if (products.length === 0) throw new Error('No products found for the given IDs');

    const total = products.reduce((sum, p) => sum + p.price, 0);

    return {
      products: products.map(p => ({ id: p._id, name: p.name, price: p.price })),
      total: parseFloat(total.toFixed(2)),
    };
  },

  async productIVA(productId) {
    const product = await fetchProduct(productId);
    if (!product) throw new Error('Product not found');

    const ivaAmount = parseFloat((product.price * IVA_PERCENTAGE / 100).toFixed(2));

    return {
      productName: product.name,
      price: product.price,
      ivaPercentage: IVA_PERCENTAGE,
      ivaAmount,
    };
  },

  async daysToExpire(data) {
    let expirationDate;

    if (data.productId) {
      const product = await fetchProduct(data.productId);
      if (!product) throw new Error('Product not found');
      expirationDate = new Date(product.expirationYear, product.expirationMonth - 1, product.expirationDay);
    } else if (data.day && data.month && data.year) {
      expirationDate = new Date(data.year, data.month - 1, data.day);
    } else {
      throw new Error('Provide a productId or day/month/year');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    const diffMs = expirationDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      expirationDate: expirationDate.toISOString().split('T')[0],
      today: today.toISOString().split('T')[0],
      daysRemaining,
      expired: daysRemaining < 0,
    };
  },
};

module.exports = ComputationsService;
