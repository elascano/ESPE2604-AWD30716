const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema(
    {
        id: { type: Number },
        name: { type: String },
        value: { type: Number },
        materials: { type: [String] },
        brand: { type: String },
        water_resistant: { type: Boolean }
    },
    { collection: "fossil" }
);

module.exports = mongoose.model("Watch", watchSchema);