const mongoose = require('mongoose');
const config = require('./appConfig');

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(config.mongoUri);

  const db = mongoose.connection;
  console.log(`Connected to MongoDB database: ${db.name}`);
}

module.exports = connectDatabase;
