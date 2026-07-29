const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('./models/Product');
const productsSeed = require('./config/products-seed.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products');

    const created = await Product.insertMany(productsSeed);
    console.log(`Inserted ${created.length} products:`);
    created.forEach(p => console.log(`  [${p._id}] ${p.name} - $${p.price} (${p.category})`));

    console.log('\nSeed completed!');
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

seed();
