const Product = require("../models/product.model");

// Add a single product
exports.addProduct = async (req, res) => {

    try {

        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (err) {

        if (err.code === 11000) {
            return res.status(409).json({ message: "Product id already exists" });
        }

        res.status(400).json({ message: err.message });

    }

};

// Add up to several products in one request (used by the "Product Catalog" screen)
exports.addProductsBulk = async (req, res) => {

    try {

        const items = Array.isArray(req.body) ? req.body : req.body.products;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }

        const created = await Product.insertMany(items, { ordered: false });

        res.status(201).json({
            message: `${created.length} product(s) added successfully`,
            products: created
        });

    } catch (err) {

        res.status(400).json({ message: err.message });

    }

};

exports.getProducts = async (req, res) => {

    try {

        const products = await Product.find().sort({ id: 1 });
        res.json(products);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

exports.getTotal = async (req, res) => {

    try {

        const products = await Product.find();

        const total = products.reduce((sum, p) => sum + p.price, 0);
        const totalWithVat = products.reduce(
            (sum, p) => sum + p.price * (1 + (p.vatRate ?? 21) / 100),
            0
        );

        res.json({
            total: Number(total.toFixed(2)),
            totalWithVat: Number(totalWithVat.toFixed(2)),
            count: products.length
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

exports.getIVA = async (req, res) => {

    try {

        const id = Number(req.params.id);
        const product = await Product.findOne({ id });

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        const rate = product.vatRate ?? 21;
        const iva = Number((product.price * (rate / 100)).toFixed(2));

        res.json({
            id: product.id,
            name: product.name,
            price: product.price,
            vatRate: rate,
            iva,
            priceWithVat: Number((product.price + iva).toFixed(2))
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

exports.getExpiration = async (req, res) => {

    try {

        const id = Number(req.params.id);
        const product = await Product.findOne({ id });

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        const today = new Date();

        const expiration = new Date(
            product.expiration.year,
            product.expiration.month - 1,
            product.expiration.day
        );

        const diff = Math.ceil((expiration - today) / (1000 * 60 * 60 * 24));

        res.json({
            id: product.id,
            name: product.name,
            daysRemaining: diff,
            status: diff >= 0 ? "Valid" : "Expired"
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};
