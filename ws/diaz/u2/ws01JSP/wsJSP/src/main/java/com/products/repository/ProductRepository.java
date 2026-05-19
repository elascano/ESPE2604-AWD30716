package com.products.repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.products.model.Product;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class ProductRepository {
    private static final String COLLECTION_NAME = "registerProduct";

    public void save(Product product) {
        MongoCollection<Document> collection = MongoDBConnection.getCollection(COLLECTION_NAME);
        Document doc = productToDocument(product);
        if (product.getId() == null) {
            collection.insertOne(doc);
            ObjectId generatedId = doc.getObjectId("_id");
            product.setId(generatedId);
        } else {
            collection.replaceOne(Filters.eq("_id", product.getId()), doc);
        }
    }

    public Product findById(String id) {
        MongoCollection<Document> collection = MongoDBConnection.getCollection(COLLECTION_NAME);
        Document doc = collection.find(Filters.eq("_id", new ObjectId(id))).first();
        return doc != null ? documentToProduct(doc) : null;
    }

    public List<Product> findAll() {
        MongoCollection<Document> collection = MongoDBConnection.getCollection(COLLECTION_NAME);
        List<Product> products = new ArrayList<>();
        try (MongoCursor<Document> cursor = collection.find().iterator()) {
            while (cursor.hasNext()) {
                products.add(documentToProduct(cursor.next()));
            }
        }
        return products;
    }

    public void delete(String id) {
        MongoCollection<Document> collection = MongoDBConnection.getCollection(COLLECTION_NAME);
        collection.deleteOne(Filters.eq("_id", new ObjectId(id)));
    }

    public List<Product> findByCategory(String category) {
        MongoCollection<Document> collection = MongoDBConnection.getCollection(COLLECTION_NAME);
        List<Product> products = new ArrayList<>();
        try (MongoCursor<Document> cursor = collection.find(Filters.eq("category", category)).iterator()) {
            while (cursor.hasNext()) {
                products.add(documentToProduct(cursor.next()));
            }
        }
        return products;
    }

    private Document productToDocument(Product product) {
        Document doc = new Document();
        if (product.getId() != null) {
            doc.append("_id", product.getId());
        }
        doc.append("name", product.getName())
           .append("description", product.getDescription())
           .append("category", product.getCategory())
           .append("weight", product.getWeight())
           .append("weightUnit", product.getWeightUnit())
           .append("price", product.getPrice())
           .append("quantity", product.getQuantity())
           .append("manufacturer", product.getManufacturer())
           .append("barcode", product.getBarcode())
           .append("createdAt", product.getCreatedAt())
           .append("updatedAt", System.currentTimeMillis());
        return doc;
    }

    private Product documentToProduct(Document doc) {
        Product product = new Product();
        product.setId(doc.getObjectId("_id"));
        product.setName(doc.getString("name"));
        product.setDescription(doc.getString("description"));
        product.setCategory(doc.getString("category"));
        product.setWeight(doc.getDouble("weight"));
        product.setWeightUnit(doc.getString("weightUnit"));
        product.setPrice(doc.getDouble("price"));
        product.setQuantity(doc.getInteger("quantity"));
        product.setManufacturer(doc.getString("manufacturer"));
        product.setBarcode(doc.getString("barcode"));
        product.setCreatedAt(doc.getLong("createdAt"));
        product.setUpdatedAt(doc.getLong("updatedAt"));
        return product;
    }
}
