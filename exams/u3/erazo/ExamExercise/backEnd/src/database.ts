import mongoose from 'mongoose';
import Config from './config';
import Product from './models/Product';

const SEED_PRODUCTS = [
  { name: 'Laptop', price: 15000, category: 'Electronics' },
  { name: 'Mouse', price: 850, category: 'Electronics' },
  { name: 'Keyboard', price: 1200, category: 'Electronics' },
  { name: 'Monitor', price: 4500, category: 'Electronics' },
  { name: 'Headphones', price: 2200, category: 'Electronics' },
  { name: 'Desk Chair', price: 3500, category: 'Furniture' },
  { name: 'Notebook', price: 80, category: 'Stationery' },
  { name: 'Backpack', price: 950, category: 'Accessories' },
  { name: 'USB Drive', price: 350, category: 'Electronics' },
  { name: 'Webcam', price: 1800, category: 'Electronics' },
];

export async function connect(): Promise<void> {
  if (!Config.mongodbUri) {
    console.warn('[Database] No MONGODB_URI configured, skipping database connection');
    return;
  }

  try {
    await mongoose.connect(Config.mongodbUri);
    console.log('[Database] Connected to MongoDB');
    await seed();
  } catch (error: any) {
    console.error('[Database] Connection failed:', error.message);
    throw error;
  }
}

async function seed(): Promise<void> {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SEED_PRODUCTS);
      console.log(`[Database] Seeded ${SEED_PRODUCTS.length} products`);
    } else {
      console.log(`[Database] ${count} products already exist, skipping seed`);
    }
  } catch (error: any) {
    console.warn('[Database] Seed failed, products may query an empty collection:', error.message);
  }
}