JSON RESPONSE STRUCTURE
=======================

All API endpoints return JSON responses with consistent structure.

SUCCESS RESPONSE FORMAT
=======================

{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "ObjectId",
    "name": "Product Name",
    "barcode": "123456789",
    "description": "Product description",
    "category": "Electronics",
    "manufacturer": "Brand Name",
    "weight": 2.5,
    "weightUnit": "kg",
    "price": 99.99,
    "quantity": 50,
    "createdAt": 1684756800000,
    "updatedAt": 1684756800000
  }
}


ERROR RESPONSE FORMAT
====================

{
  "success": false,
  "message": "Error description message"
}


GET /product/list
=================

Success Response:
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Product 1",
      "barcode": "PROD-001",
      "description": "Description here",
      "category": "Electronics",
      "manufacturer": "Brand A",
      "weight": 2.5,
      "weightUnit": "kg",
      "price": 99.99,
      "quantity": 50,
      "createdAt": 1684756800000,
      "updatedAt": 1684756800000
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Product 2",
      "barcode": "PROD-002",
      "description": "Another product",
      "category": "Food",
      "manufacturer": "Brand B",
      "weight": 500.0,
      "weightUnit": "gr",
      "price": 24.99,
      "quantity": 100,
      "createdAt": 1684756800000,
      "updatedAt": 1684756800000
    }
  ]
}

Error Response:
{
  "success": false,
  "message": "Error listing products: Database connection failed"
}


GET /product/get/{id}
====================

URL Example: /product/get/507f1f77bcf86cd799439011

Success Response:
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Laptop Pro 15",
    "barcode": "LAP-001",
    "description": "High performance laptop with 16GB RAM",
    "category": "Electronics",
    "manufacturer": "TechBrand",
    "weight": 2.1,
    "weightUnit": "kg",
    "price": 1299.99,
    "quantity": 25,
    "createdAt": 1684756800000,
    "updatedAt": 1684756800000
  }
}

Error Response:
{
  "success": false,
  "message": "Product not found"
}


GET /product/category/{category}
================================

URL Example: /product/category/Electronics

Success Response:
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Laptop Pro 15",
      "barcode": "LAP-001",
      "description": "High performance laptop",
      "category": "Electronics",
      "manufacturer": "TechBrand",
      "weight": 2.1,
      "weightUnit": "kg",
      "price": 1299.99,
      "quantity": 25,
      "createdAt": 1684756800000,
      "updatedAt": 1684756800000
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Wireless Mouse",
      "barcode": "MOU-001",
      "description": "Ergonomic wireless mouse",
      "category": "Electronics",
      "manufacturer": "PeripheralPro",
      "weight": 120.0,
      "weightUnit": "gr",
      "price": 29.99,
      "quantity": 150,
      "createdAt": 1684756800000,
      "updatedAt": 1684756800000
    }
  ]
}

Empty Result:
{
  "success": true,
  "data": []
}


POST /product/create
====================

Request Parameters:
- name (required): Product name
- barcode (required): Unique identifier
- description (optional): Product description
- category (required): Product category
- manufacturer (required): Brand name
- weight (required): Weight value
- weightUnit (required): kg, lb, or gr
- price (required): Product price in USD
- quantity (required): Stock quantity

Success Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "New Product",
    "barcode": "NEW-001",
    "description": "New product description",
    "category": "Electronics",
    "manufacturer": "NewBrand",
    "weight": 1.5,
    "weightUnit": "kg",
    "price": 199.99,
    "quantity": 10,
    "createdAt": 1684756800000,
    "updatedAt": 1684756800000
  }
}

Validation Error Response:
{
  "success": false,
  "message": "Validation error: Product name is required"
}


POST /product/update
====================

Request Parameters:
- id (required): Product ObjectId
- name (optional): Updated name
- barcode (optional): Updated barcode
- description (optional): Updated description
- category (optional): Updated category
- manufacturer (optional): Updated manufacturer
- weight (optional): Updated weight
- weightUnit (optional): Updated unit
- price (optional): Updated price
- quantity (optional): Updated quantity

Success Response:
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Product",
    "barcode": "UPD-001",
    "description": "Updated description",
    "category": "Electronics",
    "manufacturer": "UpdatedBrand",
    "weight": 3.0,
    "weightUnit": "kg",
    "price": 299.99,
    "quantity": 30,
    "createdAt": 1684756800000,
    "updatedAt": 1684757900000
  }
}

Error Response:
{
  "success": false,
  "message": "Product not found"
}


POST /product/delete/{id}
=========================

URL Example: /product/delete/507f1f77bcf86cd799439011

Success Response:
{
  "success": true,
  "message": "Product deleted successfully"
}

Error Response:
{
  "success": false,
  "message": "Product not found"
}


POST /product/convert
====================

Request Parameters:
- weight (required): Weight value to convert
- unit (required): kg, lb, or gr

Success Response:
{
  "success": true,
  "data": {
    "originalWeight": 2.5,
    "originalUnit": "kg",
    "weightInKg": 2.5,
    "weightInLb": 5.51,
    "weightInGr": 2500.0
  }
}

Another Example (Pounds to other units):
Request: weight=5.0&unit=lb

Response:
{
  "success": true,
  "data": {
    "originalWeight": 5.0,
    "originalUnit": "lb",
    "weightInKg": 2.27,
    "weightInLb": 5.0,
    "weightInGr": 2267.96
  }
}

Error Response:
{
  "success": false,
  "message": "Error converting weight: Invalid weight format"
}


FIELD TYPES
===========

id: String (MongoDB ObjectId as string)
name: String (max 255 characters)
barcode: String (max 50 characters)
description: String (optional, max 1000 characters)
category: String (enum: Electronics, Food, Clothing, Books, Chemicals, Others)
manufacturer: String (max 100 characters)
weight: Double (positive decimal)
weightUnit: String (kg, lb, gr)
price: Double (positive decimal, USD)
quantity: Integer (positive integer)
createdAt: Long (Unix timestamp in milliseconds)
updatedAt: Long (Unix timestamp in milliseconds)


CONVERSION RESULTS
==================

Weight Unit Conversions:
- 1 kg = 2.20462 lb
- 1 lb = 0.453592 kg
- 1 kg = 1000 gr
- 1 lb = 453.592 gr
- 1 gr = 0.001 kg
- 1 gr = 0.00220462 lb

Precision: 2 decimal places


ERROR CODES AND MESSAGES
=======================

HTTP Status 200 (OK):
- All successful requests
- Errors still have success: false

HTTP Status 400 (Bad Request):
- "Validation error: Product name is required"
- "Invalid weight format"
- "Product ID is required"

HTTP Status 404 (Not Found):
- "Product not found"
- "Not Found"

HTTP Status 500 (Internal Server Error):
- "Error creating product: [message]"
- "Error listing products: [message]"
- "Error deleting product: [message]"
- "Error connecting to database: [message]"


RESPONSE HEADERS
================

Content-Type: application/json;charset=UTF-8

Example Full Response Header:
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Content-Length: 256
Date: Mon, 22 May 2023 10:30:45 GMT


PAGINATION (Future Enhancement)
================================

Currently, all products returned in single request.
Future implementation could include:

{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 95
  }
}


FILTERING (Future Enhancement)
===============================

Possible filter parameters:
- minPrice: Minimum product price
- maxPrice: Maximum product price
- minQuantity: Minimum stock quantity
- maxQuantity: Maximum stock quantity
- dateFrom: Filter products created after date
- dateTo: Filter products created before date


SORTING (Future Enhancement)
============================

Possible sort parameters:
- sortBy: name, price, quantity, createdAt, updatedAt
- sortOrder: asc, desc

Example: /product/list?sortBy=price&sortOrder=asc
