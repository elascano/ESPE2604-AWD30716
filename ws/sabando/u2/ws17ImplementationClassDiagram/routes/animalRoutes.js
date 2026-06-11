const express = require("express");
const animal = require("../models/animals");
const router = express.Router();

/**
 * GET /animals/stats
 * Cómputo Global: Calcula agregaciones y estadísticas de conservación en tiempo de ejecución.
 * Nota: Debe registrarse ANTES de GET /animals/:id para evitar conflictos de ruteo.
 */
router.get("/animals/stats", async (req, res) => {
    try {
        const animalsList = await animal.getAllAnimals();
        const totalCount = animalsList.length;

        let endangeredCount = 0;
        animalsList.forEach(a => {
            if (a.isEndangered) {
                endangeredCount++;
            }
        });

        const endangeredPercentage = totalCount > 0
            ? parseFloat(((endangeredCount / totalCount) * 100).toFixed(2))
            : 0;

        res.json({
            totalCount,
            endangeredCount,
            endangeredPercentage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /animals
 * Obtiene la lista de todos los animales.
 */
router.get("/animals", async (req, res) => {
    try {
        const animalsList = await animal.getAllAnimals();
        res.json(animalsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /animals/:id
 * Obtiene un animal individual por ID.
 */
router.get("/animals/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id.trim() === "") {
            return res.status(400).json({ error: "El ID del animal es obligatorio." });
        }

        const animalObject = await animal.findOne({ id });
        if (!animalObject) {
            return res.status(404).json({ error: "Animal no encontrado." });
        }
        res.json(animalObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /animals
 * Crea un nuevo animal. El backend inyecta 'weightCategory' de forma automática.
 */
router.post("/animals", async (req, res) => {
    try {
        const { name, description, weight, age, isEndangered } = req.body;

        // Validaciones básicas de tipo y presencia
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "El nombre (name) es obligatorio y debe ser una cadena de texto." });
        }
        if (weight === undefined || typeof weight !== "number" || weight <= 0) {
            return res.status(400).json({ error: "El peso (weight) es obligatorio y debe ser un número positivo." });
        }
        if (age === undefined || typeof age !== "number" || age < 0 || !Number.isInteger(age)) {
            return res.status(400).json({ error: "La edad (age) es obligatoria y debe ser un número entero no negativo." });
        }

        const newAnimal = await animal.create({
            name: name.trim(),
            description: description ? description.toString().trim() : null,
            weight,
            age,
            isEndangered: isEndangered === true
        });

        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /animals/:id
 * Actualiza un animal existente. Recalcula 'weightCategory' si el peso cambia.
 */
router.put("/animals/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id.trim() === "") {
            return res.status(400).json({ error: "El ID del animal es obligatorio." });
        }

        // Verificar si existe el animal
        const existingAnimal = await animal.findOne({ id });
        if (!existingAnimal) {
            return res.status(404).json({ error: "Animal no encontrado para actualizar." });
        }

        const { name, description, weight, age, isEndangered } = req.body;
        const updateData = {};

        // Validaciones condicionales si los campos están presentes
        if (name !== undefined) {
            if (typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({ error: "El nombre (name) debe ser una cadena de texto válida." });
            }
            updateData.name = name.trim();
        }
        if (description !== undefined) {
            updateData.description = description ? description.toString().trim() : null;
        }
        if (weight !== undefined) {
            if (typeof weight !== "number" || weight <= 0) {
                return res.status(400).json({ error: "El peso (weight) debe ser un número positivo." });
            }
            updateData.weight = weight;
        }
        if (age !== undefined) {
            if (typeof age !== "number" || age < 0 || !Number.isInteger(age)) {
                return res.status(400).json({ error: "La edad (age) debe ser un número entero no negativo." });
            }
            updateData.age = age;
        }
        if (isEndangered !== undefined) {
            updateData.isEndangered = isEndangered === true;
        }

        // Si no se envió ningún campo válido para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "Debe proveer al menos un campo válido para actualizar." });
        }

        const updatedAnimal = await animal.update(id, updateData);
        res.json(updatedAnimal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /animals/:id
 * Elimina un animal.
 */
router.delete("/animals/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || id.trim() === "") {
            return res.status(400).json({ error: "El ID del animal es obligatorio." });
        }

        const existingAnimal = await animal.findOne({ id });
        if (!existingAnimal) {
            return res.status(404).json({ error: "Animal no encontrado para eliminar." });
        }

        await animal.deleteAnimal(id);
        res.json({ message: "Animal eliminado exitosamente.", id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;