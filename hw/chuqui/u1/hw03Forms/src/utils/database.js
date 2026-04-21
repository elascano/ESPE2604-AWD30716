require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let dbConnection;

module.exports = {
    connectToDatabase: async () => {
        try {
            await client.connect();
            dbConnection = client.db('FabulDentalDB');
            console.log('Connected to MongoDB database!');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error('No database connection established!');
        }
        return dbConnection;
    }
};
