ARCHITECTURE OVERVIEW
=====================

System Architecture: Model-View-Controller (MVC)

ARCHITECTURE DIAGRAM
====================

Client Layer (Browser)
├── Vue.js 3 (Frontend Framework)
├── form.jsp (Product Entry Page)
└── table.jsp (Inventory View Page)
        ↓
HTTP/Servlet Layer
├── ProductController (Servlet)
├── Request Routing
└── Response Formatting
        ↓
Business Logic Layer
├── ProductService (Service Logic)
├── Weight Conversion Calculations
└── Validation Rules
        ↓
Data Access Layer
├── ProductRepository (ORM Pattern)
├── MongoDB Connection Management
└── Document-to-Object Mapping
        ↓
Data Storage Layer
└── MongoDB Atlas (NoSQL Database)


LAYER DESCRIPTIONS
==================

1. PRESENTATION LAYER (View)
---------------------------
Files:
- src/main/webapp/jsp/form.jsp
- src/main/webapp/jsp/table.jsp

Responsibilities:
- Display user interface
- Handle user interactions
- Send data to controller
- Display validation messages

Technologies:
- JSP (Java Server Pages)
- Vue.js 3 (Reactive framework)
- HTML5
- CSS3

Communication:
- HTTP requests to /product/* endpoints
- JSON responses parsing


2. CONTROLLER LAYER
------------------
File:
- src/main/java/com/products/controller/ProductController.java

Responsibilities:
- Route incoming requests
- Parse HTTP parameters
- Call appropriate service methods
- Format responses
- Error handling

Request Mapping:
- GET /product/list - List all products
- GET /product/get/{id} - Get single product
- GET /product/category/{category} - Get by category
- POST /product/create - Create new product
- POST /product/update - Update product
- POST /product/delete/{id} - Delete product
- POST /product/convert - Convert weight units

Response Format:
{
  "success": true/false,
  "message": "...",
  "data": {...}
}


3. SERVICE LAYER
---------------
File:
- src/main/java/com/products/service/ProductService.java

Responsibilities:
- Business logic implementation
- Data validation
- Weight conversion calculations
- Exception handling
- Transaction coordination

Methods:
- createProduct(Product) - Create and validate
- getProductById(String) - Retrieve by ID
- getAllProducts() - List all
- updateProduct(Product) - Update with validation
- deleteProduct(String) - Delete by ID
- getProductsByCategory(String) - Filter by category
- calculateWeightConversions(Double, String) - Convert units


4. DATA ACCESS LAYER (Repository/ORM)
-------------------------------------
Files:
- src/main/java/com/products/repository/ProductRepository.java
- src/main/java/com/products/repository/MongoDBConnection.java

Responsibilities:
- Database connection management
- CRUD operations
- Object-Document mapping
- Query execution
- Connection pooling

Repository Methods:
- save(Product) - Insert or update
- findById(String) - Get by ID
- findAll() - Get all documents
- delete(String) - Delete by ID
- findByCategory(String) - Query by category


5. MODEL LAYER
--------------
File:
- src/main/java/com/products/model/Product.java

Responsibilities:
- Data structure definition
- Field validation rules
- Getters and setters
- Weight conversion methods
- Serialization

Fields:
- id: ObjectId (MongoDB ID)
- name: String
- barcode: String
- description: String
- category: String
- manufacturer: String
- weight: Double
- weightUnit: String (kg, lb, gr)
- price: Double
- quantity: Integer
- createdAt: Long (timestamp)
- updatedAt: Long (timestamp)


6. DATABASE LAYER
-----------------
Technology: MongoDB Atlas
Collection: products
Database: products

Document Structure:
{
  "_id": ObjectId,
  "name": String,
  "barcode": String,
  "description": String,
  "category": String,
  "manufacturer": String,
  "weight": Number,
  "weightUnit": String,
  "price": Number,
  "quantity": Number,
  "createdAt": Number,
  "updatedAt": Number
}


DATA FLOW
=========

Create Product Flow:
1. User fills form in form.jsp
2. Vue.js submits POST to /product/create
3. ProductController receives request
4. ProductController calls ProductService.createProduct()
5. ProductService validates Product object
6. ProductService calls ProductRepository.save()
7. ProductRepository converts to Document
8. MongoDBConnection inserts to MongoDB
9. Response returned to Vue.js
10. Success message displayed

Retrieve Products Flow:
1. User navigates to table.jsp
2. Vue.js mounted hook calls /product/list
3. ProductController calls ProductService.getAllProducts()
4. ProductService calls ProductRepository.findAll()
5. ProductRepository queries MongoDB collection
6. Documents converted to Product objects
7. Products returned as JSON
8. Vue.js renders table with data

Weight Conversion Flow:
1. User enters weight and unit in form
2. Vue.js onChange calls /product/convert
3. ProductController calls ProductService.calculateWeightConversions()
4. Service applies conversion formulas
5. Returns conversion object
6. Vue.js displays conversions


TECHNOLOGY STACK
=================

Backend:
- Java 11
- JSP (Java Server Pages)
- Servlet API 4.0.1
- MongoDB Driver 4.9.1
- Gson 2.10.1 (JSON serialization)
- SLF4J 2.0.7 (Logging)

Frontend:
- Vue.js 3
- HTML5
- CSS3
- Vanilla JavaScript

Build:
- Maven 3.6+
- Java Compiler 11

Deployment:
- Apache Tomcat 7+
- MongoDB Atlas (Cloud)


CONVERSION CALCULATIONS
======================

Kilogram to Pound:
weight_lb = weight_kg * 2.20462

Pound to Kilogram:
weight_kg = weight_lb * 0.453592

Kilogram to Gram:
weight_gr = weight_kg * 1000

Gram to Kilogram:
weight_kg = weight_gr / 1000

Pound to Gram:
weight_gr = weight_lb * 453.592

Gram to Pound:
weight_lb = weight_gr / 453.592


DESIGN PATTERNS
===============

1. Repository Pattern
   - Abstracts data access layer
   - Used in ProductRepository
   - Enables easy database swapping

2. Service Pattern
   - Encapsulates business logic
   - Used in ProductService
   - Promotes code reusability

3. MVC Pattern
   - Separates concerns
   - Model: Product
   - View: JSP pages with Vue.js
   - Controller: ProductController

4. Singleton Pattern
   - MongoDBConnection uses static methods
   - Ensures single database connection
   - Manages connection lifecycle

5. DAO (Data Access Object) Pattern
   - ProductRepository implements DAO
   - Provides database operations
   - Hides database implementation details


ERROR HANDLING
==============

Controller Level:
- HTTP status codes
- JSON error responses
- Request validation

Service Level:
- IllegalArgumentException for validation
- Runtime exceptions propagated
- Error message bundling

Repository Level:
- MongoDB exceptions caught
- Connection errors handled
- Null value checks

Frontend Level:
- Alert messages displayed
- Form validation
- User feedback via Vue.js


SCALABILITY CONSIDERATIONS
===========================

Current Design Supports:
- Horizontal scaling with load balancer
- MongoDB scaling through sharding
- Stateless servlet design
- Session-less architecture

Future Improvements:
- Cache layer (Redis)
- Asynchronous processing
- Message queues
- Database replication
- CDN for static assets


SECURITY
========

Current Implementation:
- Input validation at service layer
- Parameter sanitization
- No SQL injection (using MongoDB driver safely)
- Error messages don't leak sensitive info

Recommendations:
- HTTPS for production
- Authentication/Authorization
- CORS policy
- Rate limiting
- Input encoding
- Security headers
- Database user permissions


DATABASE INDEXING
=================

Recommended Indexes:
- db.products.createIndex({ "name": 1 })
- db.products.createIndex({ "category": 1 })
- db.products.createIndex({ "barcode": 1 })
- db.products.createIndex({ "createdAt": -1 })

Benefits:
- Faster queries
- Better sort performance
- Reduced collection scans
- Improved search functionality


MONITORING AND LOGGING
======================

Logging:
- SLF4J Simple implementation
- Output to stdout and logs
- Configurable via SLF4J

Monitoring Points:
- Database connection status
- Request processing time
- Error rates
- Product count

Metrics to Track:
- Request throughput
- Response times
- Database query performance
- Error frequency


CODE ORGANIZATION
=================

Package Structure:
com.products
├── controller/ - HTTP request handling
├── model/ - Domain objects
├── repository/ - Data access
├── service/ - Business logic
└── util/ - Utilities

Separation of Concerns:
- Each layer has single responsibility
- Minimal cross-layer dependencies
- Easy to test individual layers
- Clear interfaces between layers
