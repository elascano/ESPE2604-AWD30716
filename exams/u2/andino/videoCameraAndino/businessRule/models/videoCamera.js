const mongoose = require("mongoose");
const videoCameraSchema = new mongoose.Schema(
    {
        id: {type: Number},
        serialNumber: {type: String},
        brand: {type: String},
        model: {type: String},
        lensSize: {type: Number},
        sensorType: {type: String},
        isNewProduct: {type: Boolean},
        price: {type: Number},
        resolutionQuality: {type: String}
    },
    { collection: "videoCamera"}
);
module.exports = mongoose.model("videoCamera", videoCameraSchema);