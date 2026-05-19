Product Manager System
======================

Product Management System built with JSP, Vue.js, and MongoDB Atlas.

PROJECT STRUCTURE
=================

src/main/java/com/products/
├── controller/
│   └── ProductController.java
├── model/
│   └── Product.java
├── repository/
│   ├── MongoDBConnection.java
│   └── ProductRepository.java
└── service/
    └── ProductService.java

src/main/webapp/
├── WEB-INF/
│   └── web.xml
├── jsp/
│   ├── form.jsp
│   └── table.jsp
└── static/

FEATURES
========

1. Product Entry Form
   - 9 input fields (Name, Description, Category, Weight, Weight Unit, Price, Quantity, Manufacturer, Barcode)
   - Real-time weight conversion (kg, lb, gr)
   - Form validation
   - Vue.js reactive interface

2. Product Inventory Table
   - Display all products in a responsive table
   - Category filtering
   - Search functionality
   - Product details modal
   - Weight conversions display
   - Delete product capability
   - Stock statistics

3. Backend Architecture
   - MVC pattern implementation
   - MongoDB Atlas integration
   - Server-side data management
   - RESTful-like endpoints

TECHNOLOGIES
============

Backend:
- Java 11
- JSP
- MongoDB 4.9.1
- Gson (JSON handling)
- SLF4J (Logging)

Frontend:
- Vue.js 3
- HTML5
- CSS3

Build:
- Maven 3.6+
- Tomcat 7+

DATABASE SETUP
==============

1. Create MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas

2. Create a database named "products"

3. The system will create the "products" collection automatically

4. Update connection string in src/main/resources/application.properties:
   mongodb.uri=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority

DEPLOYMENT
==========

PREREQUISITES
- Java 11+
- Maven 3.6+
- Tomcat 7+ (or any servlet container)
- MongoDB Atlas account with running cluster

BUILD
-----

1. Navigate to project root
2. Run: mvn clean install
3. WAR file will be created in target/product-manager.war

DEPLOY TO TOMCAT
----------------

1. Copy target/product-manager.war to $CATALINA_HOME/webapps/
2. Restart Tomcat: shutdown.sh / startup.sh
3. Access application at: http://localhost:8080/product-manager/jsp/form.jsp

USING MAVEN TOMCAT PLUGIN
--------------------------

Run: mvn tomcat7:run

Access at: http://localhost:8080/product-manager/jsp/form.jsp

API ENDPOINTS
=============

GET Requests:
- /product/list - Get all products
- /product/get/{id} - Get product by ID
- /product/category/{category} - Get products by category

POST Requests:
- /product/create - Create new product
  Parameters: name, barcode, description, category, manufacturer, weight, weightUnit, price, quantity
- /product/update - Update existing product
  Parameters: id, + any field to update
- /product/delete/{id} - Delete product by ID
- /product/convert - Convert weight units
  Parameters: weight, unit

WEIGHT CONVERSION
=================

The system supports conversion between:
- Kilogram (kg)
- Pound (lb)
- Gram (gr)

Conversion factors:
1 kg = 2.20462 lb
1 lb = 0.453592 kg
1 kg = 1000 gr

NAVIGATION
==========

Form Page: /product-manager/jsp/form.jsp
Table Page: /product-manager/jsp/table.jsp

Both pages have navigation buttons to switch between them.

TROUBLESHOOTING
===============

1. Cannot connect to MongoDB:
   - Verify connection string in application.properties
   - Check MongoDB Atlas cluster status
   - Ensure IP is whitelisted in MongoDB Atlas

2. WAR deployment fails:
   - Check Java version (needs 11+)
   - Verify Maven installation
   - Check pom.xml for syntax errors

3. JSP pages not loading:
   - Verify web.xml configuration
   - Check Tomcat logs
   - Ensure JSP files are in WEB-INF/jsp/ or correct JSP path

CONFIGURATION
=============

MongoDB Connection (src/main/resources/application.properties):
mongodb.uri=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority
mongodb.database=products
mongodb.collection=products

Tomcat Configuration:
- Default port: 8080
- Context path: /product-manager
- JSP compiler: Built-in

APPLICATION PROPERTIES
======================

mongodb.uri - MongoDB Atlas connection string
mongodb.database - Database name (products)
mongodb.collection - Collection name (products)
spring.application.name - Application name
server.port - Server port

NOTES
=====

- All code is without comments as requested
- Entire system uses English language
- ORM functionality implemented through MongoDB repository pattern
- No REST API framework used, plain servlet implementation
- Vue.js for reactive frontend
- Server-side MVC architecture maintained
- Automatic timestamps for product creation/update
- Proper error handling and validation

DEVELOPMENT
===========

To add new features:

1. Create model class in com.products.model
2. Implement repository in com.products.repository
3. Add service logic in com.products.service
4. Create/update servlet in com.products.controller
5. Update JSP pages for frontend

BUILD COMMAND
=============

mvn clean package

This will generate product-manager.war in the target directory ready for deployment.
