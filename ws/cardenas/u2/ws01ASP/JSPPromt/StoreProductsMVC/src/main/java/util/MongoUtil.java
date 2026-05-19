/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class MongoUtil {

    private static final String URI =
            "mongodb+srv://admin:admin@cluster0.x7strgx.mongodb.net/?appName=Cluster0";

    private static MongoClient mongoClient = MongoClients.create(URI);

    public static MongoDatabase getDatabase() {
        return mongoClient.getDatabase("StoreDB");
    }
}