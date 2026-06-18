const { supabase } = require("../supabase");

const tableCollection = "tables";

//mapping to js 
function mapToJS(dbTable) {
    if (!dbTable) return null;
    return {
        id: dbTable.id,
        brand: dbTable.brand,
        model: dbTable.model,
        material: dbTable.material,
        shape: dbTable.shape,
        isNew: dbTable.is_new,
        price: dbTable.price
    };
}

function mapToDB(jsTable) {
    if (!jsTable) return null;
    return {
        brand: jsTable.brand,
        model: jsTable.model,
        material: jsTable.material,
        shape: jsTable.shape,
        is_new: jsTable.isNew,
        price: jsTable.price
    };
}

async function getAll() {
    console.log("getAll...");
    const { data, error } = await supabase.from(tableCollection).select("*");
    if (error) throw error;
    console.log(`found ${data.length} tables`);
    return data.map(mapToJS);
}

async function getById(id) {
    console.log(`getById: ${id}`);
    const { data, error } = await supabase
        .from(tableCollection)
        .select("*")
        .eq("id", id)
        .maybeSingle(); // maybeSingle returns null instead of throwing an error when no rows are found
    if (error) throw error;
    return mapToJS(data);
}

async function getTablesByShape(shape) {
    console.log(`getTablesByShape: ${shape}`);
    const { data, error } = await supabase
        .from(tableCollection)
        .select("*")
        .eq("shape", shape.toLowerCase());
    if (error) throw error;
    return data.map(mapToJS);
}

module.exports = {
    getAll,
    getById,
    getTablesByShape
};
