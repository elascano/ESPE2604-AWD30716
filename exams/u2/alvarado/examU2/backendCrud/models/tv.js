const mongoose = require('mongoose');

const tvSchema = new mongoose.Schema(
    {
        brand:  { type: String, required: true },
        model:  { type: String, required: true },
        status: { type: String, required: true, default: 'available' },
        stock:  { type: Number, required: true, min: 0 },
        size:   { type: Number, required: true, min: 0 },
        price:  { type: Number, required: true, min: 0 }
    },
    {
        timestamps: { createdAt: 'created_at' },  
        collection: 'tv'                          
    }
);

const TvModel = mongoose.model('tv', tvSchema);

const toTv = (doc) => ({
    serialNumber: doc._id.toString(),
    brand:        doc.brand,
    model:        doc.model,
    status:       doc.status,
    stock:        doc.stock,
    size:         doc.size,
    price:        doc.price,
    createdAt:    doc.created_at
});

const findAll = async () => {
    const docs = await TvModel.find().sort({ _id: 1 });
    return docs.map(toTv);
};

const findById = async (serialNumber) => {
    try {
        const doc = await TvModel.findById(serialNumber);
        return doc ? toTv(doc) : null;
    } catch {
        return null;
    }
};

const create = async ({ brand, model, status, stock, size, price }) => {
    const doc = await TvModel.create({ brand, model, status, stock, size, price });
    return toTv(doc);
};

module.exports = { findAll, findById, create };
