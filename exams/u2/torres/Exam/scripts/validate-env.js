require('dotenv').config();
const config = require('../src/config/appConfig');

const required = [
  'MONGODB_URI',
  'OBJECT_NAME',
  'OBJECT_PLURAL',
  'COLLECTION_NAME',
  'API_BASE_PATH',
  'ID_FIELD',
  'PRICE_FIELD'
];

const missing = required.filter((key) => !process.env[key]);

console.log('Active configuration:');
console.table({
  PORT: config.port,
  INSTANCE_ROLE: config.instanceRole,
  OBJECT_NAME: config.objectName,
  OBJECT_PLURAL: config.objectPlural,
  COLLECTION_NAME: config.collectionName,
  API_BASE_PATH: config.apiBasePath,
  ID_FIELD: config.idField,
  PRICE_FIELD: config.priceField,
  BUSINESS_RULE: config.businessRule,
  PREMIUM_BRANDS: config.premiumBrands.join(', '),
  SOFT_DELETE: config.softDelete
});

if (missing.length > 0) {
  console.warn(`Missing values in .env: ${missing.join(', ')}`);
  console.warn('The app may still run because defaults are available.');
}
