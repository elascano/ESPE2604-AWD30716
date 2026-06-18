const mongoose = require('mongoose');
const GenericObject = require('../models/GenericObject');
const config = require('../config/appConfig');
const { applyBusinessRules } = require('../services/businessRules');

function shouldIncludeDeleted(req) {
  return String(req.query.includeDeleted || '').toLowerCase() === 'true';
}

function buildIdentityFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [
        { _id: id },
        { [config.idField]: id }
      ]
    };
  }

  return { [config.idField]: id };
}

function buildReadableFilter(req) {
  const filter = shouldIncludeDeleted(req) ? {} : { deleted: { $ne: true } };

  ['assignedRange', 'brandTier', 'sizeRange'].forEach((field) => {
    if (req.query[field]) {
      filter[field] = String(req.query[field]).trim();
    }
  });

  return filter;
}

function mergeFilters(identity, visibility) {
  if (identity.$or) {
    return { $and: [identity, visibility] };
  }

  return { ...identity, ...visibility };
}

async function listObjects(req, res) {
  const filter = buildReadableFilter(req);
  const items = await GenericObject.find(filter).sort({ createdAt: -1 });

  res.json({
    count: items.length,
    object: config.objectName,
    data: items
  });
}

async function getObject(req, res) {
  const identity = buildIdentityFilter(req.params.id);
  const filter = mergeFilters(identity, buildReadableFilter(req));
  const item = await GenericObject.findOne(filter);

  if (!item) {
    return res.status(404).json({ message: `${config.objectName} not found` });
  }

  res.json(item);
}

async function createObject(req, res) {
  const payload = applyBusinessRules(req.body);
  const item = await GenericObject.create(payload);

  res.status(201).json({
    message: `${config.objectName} created successfully`,
    data: item
  });
}

async function updateObject(req, res) {
  const identity = buildIdentityFilter(req.params.id);
  const currentItem = await GenericObject.findOne(mergeFilters(identity, { deleted: { $ne: true } }));

  if (!currentItem) {
    return res.status(404).json({ message: `${config.objectName} not found` });
  }

  const nextData = {
    ...currentItem.toObject(),
    ...req.body
  };
  const payload = applyBusinessRules({
    ...req.body,
    [config.priceField]: nextData[config.priceField],
    isNew: nextData.isNew
  });
  const item = await GenericObject.findOneAndUpdate(
    mergeFilters(identity, { deleted: { $ne: true } }),
    payload,
    { new: true, runValidators: true }
  );

  if (!item) {
    return res.status(404).json({ message: `${config.objectName} not found` });
  }

  res.json({
    message: `${config.objectName} updated successfully`,
    data: item
  });
}

async function deleteObject(req, res) {
  const identity = buildIdentityFilter(req.params.id);
  const hardDelete = String(req.query.hard || '').toLowerCase() === 'true';

  if (config.softDelete && !hardDelete) {
    const item = await GenericObject.findOneAndUpdate(
      mergeFilters(identity, { deleted: { $ne: true } }),
      { deleted: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: `${config.objectName} not found` });
    }

    return res.json({
      message: `${config.objectName} logically deleted`,
      data: item
    });
  }

  const item = await GenericObject.findOneAndDelete(identity);

  if (!item) {
    return res.status(404).json({ message: `${config.objectName} not found` });
  }

  return res.json({
    message: `${config.objectName} permanently deleted`,
    data: item
  });
}

async function recomputeObject(req, res) {
  const identity = buildIdentityFilter(req.params.id);
  const item = await GenericObject.findOne(mergeFilters(identity, { deleted: { $ne: true } }));

  if (!item) {
    return res.status(404).json({ message: `${config.objectName} not found` });
  }

  const payload = applyBusinessRules(item.toObject());
  item.set(payload);
  await item.save();

  res.json({
    message: `${config.objectName} business rule recomputed`,
    data: item
  });
}

function health(req, res) {
  res.json({
    status: 'ok',
    instanceRole: config.instanceRole,
    object: config.objectName,
    collection: config.collectionName,
    basePath: config.apiBasePath
  });
}

function metadata(req, res) {
  res.json({
    objectName: config.objectName,
    objectPlural: config.objectPlural,
    collectionName: config.collectionName,
    apiBasePath: config.apiBasePath,
    instanceRole: config.instanceRole,
    idField: config.idField,
    priceField: config.priceField,
    businessRule: config.businessRule,
    premiumBrands: config.premiumBrands,
    softDelete: config.softDelete,
    expectedCoreFields: [
      config.idField,
      'brand',
      'model',
      'size',
      'gripType',
      config.priceField,
      'isNew',
      'brandTier',
      'sizeRange',
      'assignedRange',
      'description',
      'color',
      'material',
      'attributes'
    ]
  });
}

module.exports = {
  listObjects,
  getObject,
  createObject,
  updateObject,
  deleteObject,
  recomputeObject,
  health,
  metadata
};
