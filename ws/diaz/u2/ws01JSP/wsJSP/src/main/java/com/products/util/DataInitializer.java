package com.products.util;

import com.products.model.Product;
import com.products.service.ProductService;

public class DataInitializer {

    public static void initializeSampleData() {
        ProductService service = new ProductService();

        try {
            Product[] sampleProducts = {
                new Product("Laptop Pro 15", "High performance laptop with 16GB RAM and 512GB SSD",
                        "Electronics", 2.1, "kg", 1299.99, 25, "TechBrand", "LAP-001"),

                new Product("Organic Coffee Beans", "Premium arabica coffee beans from Colombia",
                        "Food", 500.0, "gr", 24.99, 100, "CoffeeMasters", "COF-001"),

                new Product("Winter Jacket", "Waterproof winter jacket with thermal insulation",
                        "Clothing", 1.2, "kg", 189.99, 40, "FashionLine", "JAC-001"),

                new Product("Python Programming Book", "Complete guide to Python 3 programming",
                        "Books", 650.0, "gr", 45.99, 60, "TechPublish", "BOK-001"),

                new Product("Industrial Lubricant", "Synthetic lubricant for machinery and equipment",
                        "Chemicals", 5.0, "kg", 35.50, 80, "ChemCorp", "CHM-001"),

                new Product("Wireless Mouse", "Ergonomic wireless mouse with USB receiver",
                        "Electronics", 120.0, "gr", 29.99, 150, "PeripheralPro", "MOU-001"),

                new Product("Cotton T-Shirt", "100% organic cotton comfortable t-shirt",
                        "Clothing", 180.0, "gr", 19.99, 200, "CasualWear", "TSH-001"),

                new Product("HDMI Cable 3m", "High speed HDMI 2.1 cable for 4K video",
                        "Electronics", 150.0, "gr", 12.99, 300, "CableTech", "HDM-001"),

                new Product("Desk Lamp LED", "Adjustable LED desk lamp with USB charging port",
                        "Electronics", 0.8, "kg", 49.99, 50, "LightSmart", "LAM-001"),

                new Product("Vitamin D3 Supplement", "1000 IU Vitamin D3 tablets bottle of 120",
                        "Food", 85.0, "gr", 14.99, 120, "HealthPro", "VIT-001")
            };

            for (Product product : sampleProducts) {
                service.createProduct(product);
                System.out.println("Inserted: " + product.getName());
            }

            System.out.println("Sample data initialized successfully");
        } catch (Exception e) {
            System.err.println("Error initializing sample data: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        initializeSampleData();
    }
}
