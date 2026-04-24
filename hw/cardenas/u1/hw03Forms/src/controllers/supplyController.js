const Supply = require('../models/Supply');

exports.createSupply = async (req, res) => {
    try {
        const { productName, productCode, productInitialQuantity, productUnitCost, productPurchaseDate, productExpirationDate } = req.body;
        const supply = new Supply(productName, productCode, productInitialQuantity, productUnitCost, productPurchaseDate, productExpirationDate);
        const result = await supply.save();
        res.status(201).json({ message: "Insumo registrado exitosamente", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al registrar el insumo" });
    }
};

exports.getSupplies = async (req, res) => {
    try {
        const supplies = await Supply.fetchAll();
        res.status(200).json(supplies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al obtener insumos" });
    }
};
