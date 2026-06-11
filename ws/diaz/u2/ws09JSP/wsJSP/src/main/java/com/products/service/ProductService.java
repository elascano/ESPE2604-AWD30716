package com.products.service;

import com.products.model.Product;
import com.products.repository.ProductRepository;

import java.util.List;

public class ProductService {
    private ProductRepository repository;

    public ProductService() {
        this.repository = new ProductRepository();
    }

    public void createProduct(Product product) {
        validateProduct(product);
        repository.save(product);
    }

    public Product getProductById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }
        return repository.findById(id);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public void updateProduct(Product product) {
        if (product.getId() == null) {
            throw new IllegalArgumentException("Product ID must be set for update");
        }
        validateProduct(product);
        repository.save(product);
    }

    public void deleteProduct(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }
        repository.delete(id);
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be null or empty");
        }
        return repository.findByCategory(category);
    }

    public ProductWeightConversion calculateWeightConversions(Double weight, String unit) {
        if (weight == null || weight < 0) {
            throw new IllegalArgumentException("Weight must be a positive number");
        }

        ProductWeightConversion conversion = new ProductWeightConversion();
        conversion.setOriginalWeight(weight);
        conversion.setOriginalUnit(unit);

        if ("kg".equalsIgnoreCase(unit)) {
            conversion.setWeightInKg(weight);
            conversion.setWeightInLb(weight * 2.20462);
            conversion.setWeightInGr(weight * 1000);
        } else if ("lb".equalsIgnoreCase(unit)) {
            conversion.setWeightInKg(weight * 0.453592);
            conversion.setWeightInLb(weight);
            conversion.setWeightInGr(weight * 453.592);
        } else if ("gr".equalsIgnoreCase(unit)) {
            conversion.setWeightInKg(weight / 1000);
            conversion.setWeightInLb(weight / 453.592);
            conversion.setWeightInGr(weight);
        } else {
            throw new IllegalArgumentException("Invalid weight unit. Use kg, lb, or gr");
        }

        return conversion;
    }

    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (product.getWeight() == null || product.getWeight() < 0) {
            throw new IllegalArgumentException("Product weight must be a positive number");
        }
        if (product.getPrice() == null || product.getPrice() < 0) {
            throw new IllegalArgumentException("Product price must be a positive number");
        }
        if (product.getQuantity() == null || product.getQuantity() < 0) {
            throw new IllegalArgumentException("Product quantity must be a positive number");
        }
    }

    public static class ProductWeightConversion {
        private Double originalWeight;
        private String originalUnit;
        private Double weightInKg;
        private Double weightInLb;
        private Double weightInGr;

        public Double getOriginalWeight() {
            return originalWeight;
        }

        public void setOriginalWeight(Double originalWeight) {
            this.originalWeight = originalWeight;
        }

        public String getOriginalUnit() {
            return originalUnit;
        }

        public void setOriginalUnit(String originalUnit) {
            this.originalUnit = originalUnit;
        }

        public Double getWeightInKg() {
            return Math.round(weightInKg * 100.0) / 100.0;
        }

        public void setWeightInKg(Double weightInKg) {
            this.weightInKg = weightInKg;
        }

        public Double getWeightInLb() {
            return Math.round(weightInLb * 100.0) / 100.0;
        }

        public void setWeightInLb(Double weightInLb) {
            this.weightInLb = weightInLb;
        }

        public Double getWeightInGr() {
            return Math.round(weightInGr * 100.0) / 100.0;
        }

        public void setWeightInGr(Double weightInGr) {
            this.weightInGr = weightInGr;
        }
    }
}
