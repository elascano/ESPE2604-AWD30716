"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartTotal = cartTotal;
exports.productIva = productIva;
exports.productExpiration = productExpiration;
exports.listProducts = listProducts;
const Product_1 = __importDefault(require("../models/Product"));
const IVA_RATE = 0.15;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
async function cartTotal(req, res) {
    const { products: items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Products array is required and must not be empty.' });
        return;
    }
    const hasInvalidItem = items.some((item) => typeof item?.name !== 'string' || !item.name.trim() ||
        typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0 ||
        (item.quantity !== undefined &&
            (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1)));
    if (hasInvalidItem) {
        res.status(400).json({ error: 'Every product requires a name, a non-negative price, and an optional positive integer quantity.' });
        return;
    }
    const cart = items.map((item) => {
        const name = item.name.trim();
        const price = item.price;
        const quantity = item.quantity === undefined ? 1 : item.quantity;
        return { name, price, quantity, subtotal: price * quantity };
    });
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({
        items: cart,
        total: parseFloat(subtotal.toFixed(2)),
    });
}
async function listProducts(req, res) {
    const products = await Product_1.default.find().lean();
    res.json(products);
}
async function productIva(req, res) {
    const { id } = req.params;
    const product = await Product_1.default.findById(id).lean();
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
async function productExpiration(req, res) {
    const { id } = req.params;
    const { day, month, year } = req.body;
    if (![day, month, year].every(Number.isInteger)) {
        res.status(400).json({ error: 'Day, month, and year are required.' });
        return;
    }
    if (day < 1 || month < 1 || month > 12 || year < 1 || year > 9999) {
        res.status(400).json({ error: 'Enter a valid day, month, and year.' });
        return;
    }
    const product = await Product_1.default.findById(id).lean();
    if (!product) {
        res.status(404).json({ error: 'Product not found.' });
        return;
    }
    const expirationDate = new Date(year, month - 1, day);
    if (expirationDate.getFullYear() !== year ||
        expirationDate.getMonth() !== month - 1 ||
        expirationDate.getDate() !== day) {
        res.status(400).json({ error: 'The expiration date is not valid.' });
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
//# sourceMappingURL=computationController.js.map