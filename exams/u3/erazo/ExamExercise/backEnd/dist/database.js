"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const Product_1 = __importDefault(require("./models/Product"));
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
async function connect() {
    try {
        await mongoose_1.default.connect(config_1.default.mongodbUri);
        console.log('[Database] Connected to MongoDB');
        await seed();
    }
    catch (error) {
        console.error('[Database] Connection failed:', error.message);
        process.exit(1);
    }
}
async function seed() {
    const count = await Product_1.default.countDocuments();
    if (count === 0) {
        await Product_1.default.insertMany(SEED_PRODUCTS);
        console.log(`[Database] Seeded ${SEED_PRODUCTS.length} products`);
    }
    else {
        console.log(`[Database] ${count} products already exist, skipping seed`);
    }
}
//# sourceMappingURL=database.js.map