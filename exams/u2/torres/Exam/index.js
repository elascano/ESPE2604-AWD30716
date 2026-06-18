const express = require('express');
const cors = require('cors');
const config = require('./src/config/appConfig');
const connectDatabase = require('./src/config/database');
const objectRoutes = require('./src/routes/objectRoutes');

const app = express();

if (config.enableCors) {
  app.use(cors());
}

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    message: `${config.objectName} API is running`,
    object: config.objectName,
    instanceRole: config.instanceRole,
    collection: config.collectionName,
    basePath: config.apiBasePath,
    health: `${config.apiBasePath}/health`,
    metadata: `${config.apiBasePath}/metadata`
  });
});

app.use(config.apiBasePath, objectRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    hint: `Use ${config.apiBasePath} for this exam API.`
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Unexpected server error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

async function start() {
  await connectDatabase();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`${config.objectName} API running on port ${config.port}`);
    console.log(`Base path: ${config.apiBasePath}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Server could not start:', error.message);
    process.exit(1);
  });
}

module.exports = app;
