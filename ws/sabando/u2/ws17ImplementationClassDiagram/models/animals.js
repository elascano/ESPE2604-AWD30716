const { supabase } = require("../supabase");

const animalCollection = "animals";

/**
 * Mapea un registro de la base de datos (snake_case) a un objeto JS (camelCase).
 */
function mapToJS(dbAnimal) {
    if (!dbAnimal) return null;
    return {
        id: dbAnimal.id,
        name: dbAnimal.name,
        description: dbAnimal.description,
        weight: dbAnimal.weight,
        age: dbAnimal.age,
        isEndangered: dbAnimal.is_endangered,
        weightCategory: dbAnimal.weight_category
    };
}

/**
 * Mapea un objeto JS (camelCase) a un payload para la base de datos (snake_case).
 */
function mapToDB(jsAnimal) {
    if (!jsAnimal) return null;
    const dbAnimal = {};
    if (jsAnimal.id !== undefined) dbAnimal.id = jsAnimal.id;
    if (jsAnimal.name !== undefined) dbAnimal.name = jsAnimal.name;
    if (jsAnimal.description !== undefined) dbAnimal.description = jsAnimal.description;
    if (jsAnimal.weight !== undefined) dbAnimal.weight = jsAnimal.weight;
    if (jsAnimal.age !== undefined) dbAnimal.age = jsAnimal.age;
    if (jsAnimal.isEndangered !== undefined) dbAnimal.is_endangered = jsAnimal.isEndangered;
    if (jsAnimal.weightCategory !== undefined) dbAnimal.weight_category = jsAnimal.weightCategory;
    return dbAnimal;
}

/**
 * Lógica de negocio (Cómputo Individual):
 * Clasifica la categoría del peso según el peso en kg.
 */
function calculateWeightCategory(weight) {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
        throw new Error("El peso (weight) debe ser un número decimal positivo mayor a cero.");
    }
    if (w < 10) return "Pequeño";
    if (w <= 100) return "Mediano";
    return "Grande";
}

/**
 * Obtener todos los animales de la base de datos.
 */
async function getAllAnimals() {
    const { data, error } = await supabase
        .from(animalCollection)
        .select('*')
        .order('id', { ascending: true });
    if (error) {
        throw error;
    }
    return (data || []).map(mapToJS);
}

/**
 * Buscar un animal por su ID único.
 */
async function findOne({ id }) {
    const { data, error } = await supabase
        .from(animalCollection)
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw error;
    }
    return mapToJS(data);
}

/**
 * Crear un nuevo animal calculando automáticamente su weightCategory.
 */
async function create(animalData) {
    if (animalData.weight === undefined) {
        throw new Error("El peso (weight) es obligatorio para registrar un animal.");
    }
    
    // Inyección de cómputo individual antes de persistir
    animalData.weightCategory = calculateWeightCategory(animalData.weight);

    const dbPayload = mapToDB(animalData);
    const { data, error } = await supabase
        .from(animalCollection)
        .insert([dbPayload])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return mapToJS(data);
}

/**
 * Actualizar un animal recalculando su weightCategory si se edita el peso.
 */
async function update(id, animalData) {
    // Recalcular categoría de peso si el peso fue modificado
    if (animalData.weight !== undefined) {
        animalData.weightCategory = calculateWeightCategory(animalData.weight);
    }

    const dbPayload = mapToDB(animalData);
    const { data, error } = await supabase
        .from(animalCollection)
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw error;
    }
    return mapToJS(data);
}

/**
 * Eliminar un animal de la base de datos.
 */
async function deleteAnimal(id) {
    const { error } = await supabase
        .from(animalCollection)
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
    return true;
}

module.exports = {
    getAllAnimals,
    findOne,
    create,
    update,
    deleteAnimal
};
