const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Computer Store API is running!' });
});

app.get('/api/products', async (req, res) => {
  try {
    const { q } = req.query;
    
    let products;
    if (q) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        }
      });
    } else {
      products = await prisma.product.findMany({
        orderBy: { id: 'asc' }
      });
    }
    
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

app.post('/api/products/calculate-iva', async (req, res) => {
  try {
    const { price, id } = req.body;
    let targetPrice = 0;

    if (id !== undefined) {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found for IVA calculation' });
      }
      targetPrice = product.price;
    } else if (price !== undefined) {
      targetPrice = parseFloat(price);
      if (isNaN(targetPrice) || targetPrice < 0) {
        return res.status(400).json({ error: 'Invalid price provided' });
      }
    } else {
      return res.status(400).json({ error: 'Please provide either a product ID or a price' });
    }

    const IVA_RATE = 0.15;
    const ivaAmount = targetPrice * IVA_RATE;

    return res.json({
      price: targetPrice,
      ivaRate: IVA_RATE,
      ivaAmount: parseFloat(ivaAmount.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating IVA:', error);
    return res.status(500).json({ error: 'Failed to calculate IVA' });
  }
});

app.post('/api/products/calculate-expiration', (req, res) => {
  try {
    const { day, month, year } = req.body;

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      return res.status(400).json({ error: 'Invalid expiration date values' });
    }

    if (m < 1 || m > 12 || d < 1 || d > 31) {
      return res.status(400).json({ error: 'Month must be between 1-12, Day must be between 1-31' });
    }

    const expirationDate = new Date(y, m - 1, d, 23, 59, 59);
    
    if (isNaN(expirationDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date constructed. Please check the calendar limits.' });
    }

    const currentDate = new Date();
    
    currentDate.setHours(0, 0, 0, 0);
    const expCompare = new Date(y, m - 1, d, 0, 0, 0);

    const diffTime = expCompare.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = 'active';
    let daysLeft = diffDays;
    
    if (diffDays < 0) {
      status = 'expired';
      daysLeft = Math.abs(diffDays);
    } else if (diffDays === 0) {
      status = 'expires today';
    }

    return res.json({
      expirationDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      currentDate: currentDate.toISOString().split('T')[0],
      daysLeft,
      status
    });
  } catch (error) {
    console.error('Error calculating expiration time:', error);
    return res.status(500).json({ error: 'Failed to calculate expiration time' });
  }
});

app.post('/api/cart/calculate-total', (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    let subtotal = 0;
    let ivaTotal = 0;
    const IVA_RATE = 0.15;

    for (const item of items) {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);

      if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
        return res.status(400).json({ error: 'Invalid price or quantity in items list' });
      }

      const itemTotal = price * quantity;
      subtotal += itemTotal;
      ivaTotal += itemTotal * IVA_RATE;
    }

    const total = subtotal + ivaTotal;

    return res.json({
      subtotal: parseFloat(subtotal.toFixed(2)),
      ivaRate: IVA_RATE,
      ivaTotal: parseFloat(ivaTotal.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return res.status(500).json({ error: 'Failed to calculate cart total' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
