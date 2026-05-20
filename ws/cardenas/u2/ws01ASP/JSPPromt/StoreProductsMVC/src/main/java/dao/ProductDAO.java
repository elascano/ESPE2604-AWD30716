/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

import model.StoreProduct;
import org.bson.Document;
import util.MongoUtil;

import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    private MongoCollection<Document> collection;

    public ProductDAO() {
        MongoDatabase database = MongoUtil.getDatabase();
        collection = database.getCollection("products");
    }

    // INSERT PRODUCT
    public void saveProduct(StoreProduct product) {

        Document doc = new Document("id", product.getId())
                .append("name", product.getName())
                .append("quantity", product.getQuantity());

        collection.insertOne(doc);
    }

    // GET ALL PRODUCTS
    public List<StoreProduct> getAllProducts() {

        List<StoreProduct> list = new ArrayList<>();

        MongoCursor<Document> cursor = collection.find().iterator();

        while (cursor.hasNext()) {

            Document doc = cursor.next();

            StoreProduct product = new StoreProduct();

            product.setId(doc.getInteger("id"));
            product.setName(doc.getString("name"));
            product.setQuantity(doc.getInteger("quantity"));

            list.add(product);
        }

        return list;
    }

    // TOTAL QUANTITY
    public int getTotalQuantity() {

        int total = 0;

        List<StoreProduct> products = getAllProducts();

        for (StoreProduct p : products) {
            total += p.getQuantity();
        }

        return total;
    }
}