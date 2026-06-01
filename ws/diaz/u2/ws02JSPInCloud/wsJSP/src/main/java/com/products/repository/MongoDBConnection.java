package com.products.repository;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class MongoDBConnection {
    private static MongoClient mongoClient;
    private static MongoDatabase database;
    private static final String CONNECTION_STRING = "mongodb://cvdiaz3_db_user:admin123@ac-b9fz9za-shard-00-00.vigvruj.mongodb.net:27017,ac-b9fz9za-shard-00-01.vigvruj.mongodb.net:27017,ac-b9fz9za-shard-00-02.vigvruj.mongodb.net:27017/?ssl=true&replicaSet=atlas-800eio-shard-0&authSource=admin&appName=Cluster0";
    private static final String DATABASE_NAME = "productWeight";

    public static synchronized MongoClient getClient() {
        if (mongoClient == null) {
            mongoClient = MongoClients.create(CONNECTION_STRING);
        }
        return mongoClient;
    }

    public static synchronized MongoDatabase getDatabase() {
        if (database == null) {
            database = getClient().getDatabase(DATABASE_NAME);
        }
        return database;
    }

    public static MongoCollection<Document> getCollection(String collectionName) {
        return getDatabase().getCollection(collectionName);
    }

    public static void closeConnection() {
        if (mongoClient != null) {
            mongoClient.close();
            mongoClient = null;
            database = null;
        }
    }
}
