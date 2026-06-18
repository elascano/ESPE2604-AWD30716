const mongoose = require('mongoose');
const config = require('../config/appConfig');

const schemaDefinition = {
  objectType: { type: String, default: config.objectName },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  size: { type: String, required: true, trim: true },
  gripType: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  color: { type: String, trim: true },
  material: { type: String, trim: true },
  isNew: { type: Boolean, default: true },
  brandTier: { type: String, trim: true },
  sizeRange: { type: String, trim: true },
  assignedRange: { type: String, trim: true },
  rangeReason: { type: String, trim: true },
  deleted: { type: Boolean, default: false },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
};

schemaDefinition[config.idField] = {
  type: String,
  required: true,
  unique: true,
  trim: true
};

schemaDefinition[config.priceField] = {
  type: Number,
  required: true,
  min: 0
};

const genericObjectSchema = new mongoose.Schema(schemaDefinition, {
  collection: config.collectionName,
  timestamps: true,
  strict: true,
  suppressReservedKeysWarning: true
});

genericObjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model(config.modelName, genericObjectSchema);
