package com.products.model;

import org.bson.types.ObjectId;
import java.io.Serializable;

public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    private ObjectId id;
    private String name;
    private String description;
    private String category;
    private Double weight;
    private String weightUnit;
    private Double price;
    private Integer quantity;
    private String manufacturer;
    private String barcode;
    private Long createdAt;
    private Long updatedAt;

    public Product() {
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }

    public Product(String name, String description, String category, Double weight,
                   String weightUnit, Double price, Integer quantity, String manufacturer, String barcode) {
        this();
        this.name = name;
        this.description = description;
        this.category = category;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.price = price;
        this.quantity = quantity;
        this.manufacturer = manufacturer;
        this.barcode = barcode;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getWeightUnit() {
        return weightUnit;
    }

    public void setWeightUnit(String weightUnit) {
        this.weightUnit = weightUnit;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getWeightInKilogram() {
        if (weight == null) return 0.0;
        return "lb".equalsIgnoreCase(weightUnit) ? weight * 0.453592 : weight;
    }

    public Double getWeightInPounds() {
        if (weight == null) return 0.0;
        return "kg".equalsIgnoreCase(weightUnit) ? weight * 2.20462 : weight;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", weight=" + weight +
                ", weightUnit='" + weightUnit + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", manufacturer='" + manufacturer + '\'' +
                ", barcode='" + barcode + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
