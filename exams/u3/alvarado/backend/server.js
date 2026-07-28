require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const app = express();
app.use(cors());
app.use(express.json());

const calculateTotal = (items) =>
  Number(items.reduce((sum, item) => sum + item.price, 0).toFixed(2));


app.get('/products', async (req, res) => {
  const products = await Product.find().select('id name price vatRate image description -_id');
  res.json(products);
});


app.get('/products/:id', async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) })
    .select('id name price vatRate image description -_id');

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});


app.post('/cart', async (req, res) => {
  const { id } = req.body;
  const product = await Product.findOne({ id: Number(id) });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
  }

  cart.items.push({
    id: product.id,
    name: product.name,
    price: product.price,
    vatRate: product.vatRate,
    image: product.image
  });

  await cart.save();

  res.json({ cart: cart.items, total: calculateTotal(cart.items) });
});


app.get('/cart', async (req, res) => {
  const cart = await Cart.findOne();
  const items = cart ? cart.items : [];
  res.json({ cart: items, total: calculateTotal(items) });
});


app.delete('/cart', async (req, res) => {
  await Cart.deleteMany({});
  res.json({ cart: [], total: 0 });
});


app.get('/products/:id/vat', async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const vatAmount = product.price * product.vatRate;

  res.json({
    id: product.id,
    name: product.name,
    vatRate: product.vatRate,
    vatAmount: Number(vatAmount.toFixed(2))
  });
});


app.post('/products/:id/expiration', async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { day, month, year } = req.body;

  if (!day || !month || !year) {
    return res.status(400).json({ error: 'day, month and year are required' });
  }

  const expirationDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(expirationDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);

  const diffMs = expirationDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  res.json({
    id: product.id,
    expirationDate: `${day}/${month}/${year}`,
    daysRemaining,
    expired: daysRemaining < 0
  });
});

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
});
