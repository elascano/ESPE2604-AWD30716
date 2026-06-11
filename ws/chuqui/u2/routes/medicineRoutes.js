const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicine");

// Escribir: Insertar medicamentos (Ya lo tenías, adaptado para múltiples)
router.post("/", async (req, res) => {
    try {
        const newMedicines = await Medicine.insertMany(req.body);
        res.status(201).json({
            code: 201,
            message: "Medicines inserted",
            data: newMedicines
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Server error", error: error.message });
    }
});

// Leer: Obtener todos los medicamentos
router.get("/", async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json({
            code: 200,
            message: "Medicines retrieved successfully",
            data: medicines
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Error retrieving medicines", error: error.message });
    }
});

// Leer y Calcular: Reglas de Negocio
router.get("/reportes", async (req, res) => {
    try {
        const medicines = await Medicine.find();
        const currentDate = new Date();

        // Variables para los cálculos totales
        let totalInventoryItems = 0;
        let totalExpired = 0;
        const lowStockAlerts = [];
        const expiredMedicines = [];

        medicines.forEach(med => {
            // Cálculo Total General
            totalInventoryItems += med.stock;

            // Regla 1: Cálculo de Caducidad (FEFO)
            if (new Date(med.expirationDate) < currentDate) {
                totalExpired++;
                expiredMedicines.push({ name: med.name, expiration: med.expirationDate });
            }

            // Regla 2: Alerta de Stock Mínimo
            if (med.stock <= med.minStock) {
                lowStockAlerts.push({ name: med.name, currentStock: med.stock, minRequired: med.minStock });
            }
        });

        res.status(200).json({
            code: 200,
            resumen: {
                inventarioTotalUnidades: totalInventoryItems,
                medicamentosCaducadosTotal: totalExpired
            },
            alertasStock: lowStockAlerts,
            detalleCaducados: expiredMedicines
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: "Error calculating data", error: error.message });
    }
});

module.exports = router;