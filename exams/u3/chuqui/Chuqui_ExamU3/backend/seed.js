const Product = require('./models/Product');
const products = require('./data/products.json');
const connectDB = require('./config/database');

connectDB().then(async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Products imported successfully.');
        process.exit();
    } catch (error) {
        console.error('Import error:', error);
        process.exit(1);
    }
});
