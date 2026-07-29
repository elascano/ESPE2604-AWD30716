import { Request, Response } from 'express';
import Product from '../models/Product';

const IVA_RATE = 0.15;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

async function cartTotal(req: Request, res: Response): Promise<void> {
  const { products: items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Products array is required and must not be empty.' });
    return;
  }

  const validated = items.map((p: any, i: number) => ({
    name: (p.name && typeof p.name === 'string' ? p.name.trim() : `Product ${i + 1}`) || `Product ${i + 1}`,
    price: typeof p.price === 'number' && p.price >= 0 ? p.price : 0,
    quantity: typeof p.quantity === 'number' && p.quantity > 0 ? Math.floor(p.quantity) : 1,
  }));

  const cart = validated.map((p: any) => ({ ...p, subtotal: p.price * p.quantity }));
  const subtotal = cart.reduce((s: number, i: any) => s + i.subtotal, 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  res.json({
    items: cart,
    subtotal: parseFloat(subtotal.toFixed(2)),
    iva: parseFloat(iva.toFixed(2)),
    ivaRate: IVA_RATE,
    total: parseFloat(total.toFixed(2)),
  });
}

async function listProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find().lean();
  res.json(products);
}

async function productIva(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const product = await Product.findById(id).lean();

  if (!product) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const iva = product.price * IVA_RATE;

  res.json({
    product: { _id: product._id, name: product.name, price: product.price },
    iva: parseFloat(iva.toFixed(2)),
    ivaRate: IVA_RATE,
    pricePlusIva: parseFloat((product.price + iva).toFixed(2)),
  });
}

async function productExpiration(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  let { day, month, year } = req.body;

  day = Number(day);
  month = Number(month);
  year = Number(year);

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    res.status(400).json({ error: 'Day, month, and year are required and must be integers.' });
    return;
  }

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2020 || year > 2100) {
    res.status(400).json({ error: 'Enter a valid day (1-31), month (1-12), and year (2020-2100).' });
    return;
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }

  const expirationDate = new Date(year, month - 1, day);
  if (
    expirationDate.getFullYear() !== year ||
    expirationDate.getMonth() !== month - 1 ||
    expirationDate.getDate() !== day
  ) {
    res.status(400).json({ error: 'The expiration date is not valid (e.g., Feb 30).' });
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = expirationDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / MILLISECONDS_PER_DAY);

  res.json({
    product: { _id: product._id, name: product.name },
    expirationDate: expirationDate.toISOString().split('T')[0],
    daysLeft,
    isExpired: daysLeft < 0,
    status: daysLeft < 0 ? 'Expired' : daysLeft === 0 ? 'Expires today' : `${daysLeft} days remaining`,
  });
}

export { cartTotal, productIva, productExpiration, listProducts };
