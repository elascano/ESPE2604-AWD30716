require('dotenv').config();

function toBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'y'].includes(String(value).toLowerCase());
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toPascalCase(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function cleanPath(path) {
  const value = path || '/api/items';
  return value.startsWith('/') ? value : `/${value}`;
}

function toList(value, fallback) {
  const source = value || fallback;
  return source
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const objectName = process.env.OBJECT_NAME || 'glove';
const objectPlural = process.env.OBJECT_PLURAL || `${objectName}s`;
const businessRule = (process.env.BUSINESS_RULE || 'brand_size_range').toLowerCase();
const allowedRules = new Set(['none', 'brand_size_range']);
const instanceRole = (process.env.INSTANCE_ROLE || 'all').toLowerCase();
const allowedInstanceRoles = new Set(['all', 'read', 'write']);

module.exports = {
  port: toNumber(process.env.PORT, 3000),
  enableCors: toBoolean(process.env.ENABLE_CORS, true),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exam_u2_goalkeeper_gloves',
  objectName,
  objectPlural,
  modelName: toPascalCase(objectName || 'Item') || 'Item',
  collectionName: process.env.COLLECTION_NAME || objectPlural,
  apiBasePath: cleanPath(process.env.API_BASE_PATH || `/api/${objectPlural}`),
  idField: process.env.ID_FIELD || 'serialNumber',
  priceField: process.env.PRICE_FIELD || 'price',
  businessRule: allowedRules.has(businessRule) ? businessRule : 'brand_size_range',
  premiumBrands: toList(process.env.PREMIUM_BRANDS, 'Adidas,Nike,Puma,Reusch,Uhlsport,Elite'),
  instanceRole: allowedInstanceRoles.has(instanceRole) ? instanceRole : 'all',
  softDelete: toBoolean(process.env.SOFT_DELETE, true)
};
