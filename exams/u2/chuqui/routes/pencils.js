const express = require('express');
const router = express.Router();
const Pencil = require('../models/Pencil');

// GET /api/pencils  - Listar todos los lápices o buscar por query
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.brand) {
            filter.brand = new RegExp(req.query.brand, 'i');
        }
        if (req.query.model) {
            filter.model = new RegExp(req.query.model, 'i');
        }
        if (req.query.hardness) {
            filter.hardness = req.query.hardness;
        }
        if (req.query.color) {
            filter.color = new RegExp(req.query.color, 'i');
        }

        const pencils = await Pencil.find(filter);
        res.json(pencils);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// POST /api/pencils  - Crear un nuevo lápiz
router.post('/', async (req, res) => {
    try {
        const pencil = new Pencil(req.body);
        const saved = await pencil.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear pencil', error });
    }
});

// GET /api/pencils/:id  - Buscar un lápiz por id
router.get('/:id', async (req, res) => {
    try {
        const pencil = await Pencil.findOne({ id: parseInt(req.params.id, 10) });
        if (!pencil) {
            return res.status(404).json({ message: 'Pencil not found' });
        }
        res.json(pencil);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// PUT /api/pencils/:id  - Actualizar un lápiz por id
router.put('/:id', async (req, res) => {
    try {
        const updated = await Pencil.findOneAndUpdate(
            { id: parseInt(req.params.id, 10) },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Pencil not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar pencil', error });
    }
});

// DELETE /api/pencils/:id  - Eliminar un lápiz por id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Pencil.findOneAndDelete({ id: parseInt(req.params.id, 10) });
        if (!deleted) {
            return res.status(404).json({ message: 'Pencil not found' });
        }
        res.json({ message: 'Pencil eliminado exitosamente', pencil: deleted });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

