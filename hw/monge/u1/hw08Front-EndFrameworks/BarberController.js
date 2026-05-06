const path = require('path')
const ServiceModel = require('../models/ServiceModel')
const ProductModel = require('../models/ProductModel')

const viewsPath = path.join(__dirname, '../views/barber')

exports.dashboard = (req, res) => {
    res.sendFile(path.join(viewsPath, 'dashboard.html'))
}

// === API REST Methods for Services ===

exports.getServices = async (req, res) => {
    try {
        const { barbershop_id } = req.query; // Usually extracted from auth token
        const where = barbershop_id ? { barbershop_id } : {};
        const services = await ServiceModel.findAll(where);
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createService = async (req, res) => {
    try {
        const data = req.body;
        const newService = await ServiceModel.create(data);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedService = await ServiceModel.update(id, data);
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await ServiceModel.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// === API REST Methods for Products ===

exports.getProducts = async (req, res) => {
    try {
        const { barbershop_id } = req.query;
        const where = barbershop_id ? { barbershop_id } : {};
        const products = await ProductModel.findAll(where);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;
        const newProduct = await ProductModel.create(data);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedProduct = await ProductModel.update(id, data);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.delete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
