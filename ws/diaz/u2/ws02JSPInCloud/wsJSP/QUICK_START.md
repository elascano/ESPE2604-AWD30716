QUICK START GUIDE
=================

ENGLISH VERSION
===============

Prerequisites:
- Java 11 or higher
- Maven 3.6+
- MongoDB Atlas account

Step 1: Configure MongoDB
1. Create account at mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Create database "products" with collection "products"
6. Get connection string

Step 2: Update Configuration
1. Open: src/main/resources/application.properties
2. Replace: mongodb.uri with your connection string
   Format: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority

Step 3: Build Project
Windows:
  cd path\to\wsJSP
  build.bat
  Select option 2

Linux/Mac:
  cd path/to/wsJSP
  mvn clean tomcat7:run

Step 4: Access Application
1. Open browser
2. Go to: http://localhost:8080/product-manager/jsp/form.jsp
3. Add products using the form
4. View all products at: http://localhost:8080/product-manager/jsp/table.jsp

Features:
- 9 product input fields
- Real-time weight conversion
- Product table with filtering
- Weight display in kg and lb
- MongoDB backend
- Vue.js responsive interface


SPANISH VERSION
===============

Requisitos previos:
- Java 11 o superior
- Maven 3.6+
- Cuenta de MongoDB Atlas

Paso 1: Configurar MongoDB
1. Crear cuenta en mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Crear usuario de base de datos
4. Permitir IP (0.0.0.0/0 para desarrollo)
5. Crear base de datos "products" con colección "products"
6. Obtener cadena de conexión

Paso 2: Actualizar Configuración
1. Abrir: src/main/resources/application.properties
2. Reemplazar: mongodb.uri con tu cadena de conexión
   Formato: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority

Paso 3: Compilar Proyecto
Windows:
  cd path\to\wsJSP
  build.bat
  Seleccionar opción 2

Linux/Mac:
  cd path/to/wsJSP
  mvn clean tomcat7:run

Paso 4: Acceder a la Aplicación
1. Abrir navegador
2. Ir a: http://localhost:8080/product-manager/jsp/form.jsp
3. Agregar productos usando el formulario
4. Ver todos los productos en: http://localhost:8080/product-manager/jsp/table.jsp

Características:
- 9 campos de entrada de producto
- Conversión de peso en tiempo real
- Tabla de productos con filtrado
- Visualización de peso en kg y lb
- Backend de MongoDB
- Interfaz responsive con Vue.js


TROUBLESHOOTING
===============

English:

Problem: Maven not found
Solution: 
- Install Maven from apache.org
- Add to system PATH
- Restart Command Prompt
- Test: mvn -version

Problem: Cannot connect to MongoDB
Solution:
- Check connection string
- Verify cluster is running
- Check IP whitelist
- Verify credentials

Problem: Port 8080 in use
Solution:
- Change port in pom.xml
- Or stop application using port
- Or use different port: mvn tomcat7:run -DskipTests -Dtomcat.port=8081

Problem: JSP page not loading
Solution:
- Check Tomcat logs
- Clear browser cache
- Verify MongoDB connection
- Wait 15 seconds for Tomcat startup


Español:

Problema: Maven no encontrado
Solución:
- Instalar Maven desde apache.org
- Agregar a la ruta del sistema (PATH)
- Reiniciar Símbolo del sistema
- Probar: mvn -version

Problema: No se puede conectar a MongoDB
Solución:
- Verificar cadena de conexión
- Confirmar que el cluster está ejecutándose
- Verificar lista blanca de IP
- Verificar credenciales

Problema: Puerto 8080 en uso
Solución:
- Cambiar puerto en pom.xml
- O detener aplicación usando el puerto
- O usar puerto diferente: mvn tomcat7:run -DskipTests -Dtomcat.port=8081

Problema: Página JSP no carga
Solución:
- Verificar logs de Tomcat
- Limpiar caché del navegador
- Verificar conexión a MongoDB
- Esperar 15 segundos para inicio de Tomcat


PROJECT STRUCTURE
=================

wsJSP/
├── pom.xml (Maven configuration)
├── README.md (Project overview)
├── DEPLOYMENT.md (Deployment guide)
├── MONGODB_SETUP.md (Database setup)
├── ARCHITECTURE.md (System architecture)
├── QUICK_START.md (This file)
├── build.bat (Windows build script)
├── .gitignore
├── src/
│   ├── main/
│   │   ├── java/com/products/
│   │   │   ├── controller/
│   │   │   │   └── ProductController.java
│   │   │   ├── model/
│   │   │   │   └── Product.java
│   │   │   ├── repository/
│   │   │   │   ├── MongoDBConnection.java
│   │   │   │   └── ProductRepository.java
│   │   │   ├── service/
│   │   │   │   └── ProductService.java
│   │   │   └── util/
│   │   │       └── DataInitializer.java
│   │   ├── resources/
│   │   │   └── application.properties
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── web.xml
│   │       ├── jsp/
│   │       │   ├── form.jsp
│   │       │   └── table.jsp
│   │       └── static/
│   │           └── js/
│   └── test/
└── target/ (build output)


SUPPORTED WEIGHT UNITS
======================

- kg (Kilogram) - SI base unit
- lb (Pound) - Imperial unit
- gr (Gram) - SI unit


PRODUCT FIELDS
==============

1. Product Name * (required)
2. Barcode * (required)
3. Description
4. Category * (required)
5. Manufacturer * (required)
6. Weight * (required)
7. Weight Unit * (required)
8. Price * (required)
9. Quantity * (required)

* indicates required field


API ENDPOINTS
=============

GET /product/list
- Returns all products

GET /product/get/{id}
- Returns product by ID

GET /product/category/{category}
- Returns products by category

POST /product/create
- Creates new product

POST /product/update
- Updates existing product

POST /product/delete/{id}
- Deletes product by ID

POST /product/convert
- Converts weight units


BROWSER COMPATIBILITY
====================

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Vue.js 3 requires:
- ES2015 (ES6) support
- Promise support
- Proxy support

Modern browsers recommended


PERFORMANCE TIPS
=================

1. MongoDB:
   - Add indexes for frequently queried fields
   - Monitor query performance
   - Optimize connection string

2. Tomcat:
   - Increase heap memory if needed
   - Enable compression
   - Configure caching

3. Frontend:
   - Clear browser cache periodically
   - Minimize table size for better sorting
   - Use search/filter features


ADDING SAMPLE DATA
==================

Option 1: Using DataInitializer
- mvn exec:java -Dexec.mainClass="com.products.util.DataInitializer"

Option 2: Manual Entry
- Use form.jsp to add products manually
- Navigate to table.jsp to view

Option 3: MongoDB Import
- Use mongoimport command with JSON file


NEXT STEPS
==========

After Deployment:
1. Add products via form
2. View products in table
3. Test weight conversions
4. Test search and filtering
5. Test delete functionality
6. Monitor MongoDB in Atlas console

For Production:
1. Set up HTTPS
2. Restrict IP whitelist
3. Use strong credentials
4. Enable authentication
5. Set up backups
6. Monitor performance


ADDITIONAL RESOURCES
====================

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vue.js: https://vuejs.org/
- Apache Tomcat: https://tomcat.apache.org/
- Maven: https://maven.apache.org/
- Java: https://www.oracle.com/java/
- MDN Web Docs: https://developer.mozilla.org/


SUPPORT AND DOCUMENTATION
==========================

Files to Read:
1. README.md - Project overview
2. ARCHITECTURE.md - Technical design
3. DEPLOYMENT.md - Deployment details
4. MONGODB_SETUP.md - Database configuration
5. QUICK_START.md - This file

Common Commands:
Build: mvn clean install
Run: mvn tomcat7:run
Test: mvn test
Package: mvn clean package

Getting Help:
- Check log files
- Review documentation files
- Check MongoDB Atlas dashboard
- Verify system requirements
