package com.almacen.dao;

import com.almacen.model.Product;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

import java.util.ArrayList;
import java.util.List;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

public class ProductDAO {
    private static final String URI = "mongodb+srv://root123:root123@cluster0.0s6q0vr.mongodb.net/?appName=Cluster0";
    private MongoCollection<Product> collection;

    public ProductDAO() {
        CodecRegistry pojoCodecRegistry = fromRegistries(MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(URI))
                .codecRegistry(pojoCodecRegistry)
                .build();

        MongoClient mongoClient = MongoClients.create(settings);
        MongoDatabase database = mongoClient.getDatabase("warehouse_db");
        collection = database.getCollection("products", Product.class);
    }

    public void insertProduct(Product p) {
        collection.insertOne(p);
    }

    public List<Product> getAll() {
        List<Product> products = new ArrayList<>();
        collection.find().into(products);
        return products;
    }
}
