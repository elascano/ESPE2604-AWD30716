const Product = require('../models/Product');

const normalize = value => String(value ?? '').trim().toLowerCase();

const roundToTwo = value => Math.round(value * 100) / 100;

const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatProduct = product => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    dateExpiration: product.dateExpiration.toISOString().slice(0, 10),
    daysExpiration: product.daysExpiration ?? null
});

const findCatalogProduct = async name => {
    const term = normalize(name);

    if (!term) {
        return null;
    }

    return Product.findOne({
        $or: [
            { name: new RegExp(`^${escapeRegExp(term)}$`, 'i') },
            { name: new RegExp(escapeRegExp(term), 'i') }
        ]
    });
};

const getCatalog = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products.map(formatProduct)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error loading catalog',
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, dateExpiration } = req.body;
        const productName = String(name ?? '').trim();
        const productPrice = Number(price);
        const expirationDate = new Date(dateExpiration);

        if (!productName || !Number.isFinite(productPrice) || Number.isNaN(expirationDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, and expiration date are required.'
            });
        }

        const existingProduct = await Product.findOne({ name: new RegExp(`^${productName}$`, 'i') });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: 'A product with that name already exists.'
            });
        }

        const product = await Product.create({
            name: productName,
            price: roundToTwo(productPrice),
            dateExpiration: expirationDate,
            daysExpiration: null
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: formatProduct(product)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

const calculateCartTotal = (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length !== 5) {
            return res.status(400).json({
                success: false,
                message: 'You must enter five products.'
            });
        }

        const normalizedItems = items.map((item, index) => {
            const name = String(item?.name ?? '').trim();
            const price = Number(item?.price);

            if (!name || !Number.isFinite(price)) {
                throw new Error(`Invalid product at position ${index + 1}.`);
            }

            return {
                name,
                price: roundToTwo(price)
            };
        });

        const total = roundToTwo(
            normalizedItems.reduce((sum, item) => sum + item.price, 0)
        );

        res.status(200).json({
            success: true,
            data: {
                items: normalizedItems,
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const calculateIva = async (req, res) => {
    try {
        const { name, price, ivaRate } = req.body;
        const product = await findCatalogProduct(name);
        const basePrice = Number.isFinite(Number(price)) ? Number(price) : product?.price;

        if (!Number.isFinite(basePrice)) {
            return res.status(400).json({
                success: false,
                message: 'You must enter a valid product.'
            });
        }

        const rate = Number.isFinite(Number(ivaRate)) ? Number(ivaRate) : 0.12;
        const ivaAmount = roundToTwo(basePrice * rate);

        res.status(200).json({
            success: true,
            data: {
                productName: product?.name ?? String(name ?? '').trim(),
                basePrice: roundToTwo(basePrice),
                ivaRate: rate,
                ivaAmount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating VAT',
            error: error.message
        });
    }
};

const calculateExpiration = async (req, res) => {
    try {
        const { name, day, month, year } = req.body;
        const product = await findCatalogProduct(name);
        const dayNumber = Number(day);
        const monthNumber = Number(month);
        const yearNumber = Number(year);

        if (!Number.isInteger(dayNumber) || !Number.isInteger(monthNumber) || !Number.isInteger(yearNumber)) {
            return res.status(400).json({
                success: false,
                message: 'You must enter a valid date.'
            });
        }

        const expirationDate = new Date(yearNumber, monthNumber - 1, dayNumber);

        if (
            Number.isNaN(expirationDate.getTime()) ||
            expirationDate.getDate() !== dayNumber ||
            expirationDate.getMonth() !== monthNumber - 1 ||
            expirationDate.getFullYear() !== yearNumber
        ) {
            return res.status(400).json({
                success: false,
                message: 'The entered date is not valid.'
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expirationDate.setHours(0, 0, 0, 0);

        const daysRemaining = Math.ceil((expirationDate.getTime() - today.getTime()) / 86400000);

        res.status(200).json({
            success: true,
            data: {
                productName: product?.name ?? String(name ?? '').trim(),
                expirationDate: expirationDate.toISOString().slice(0, 10),
                daysRemaining
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating expiration time',
            error: error.message
        });
    }
};

module.exports = {
    getCatalog,
    createProduct,
    calculateCartTotal,
    calculateIva,
    calculateExpiration
};
