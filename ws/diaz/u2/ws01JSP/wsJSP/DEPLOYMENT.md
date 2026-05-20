DEPLOYMENT GUIDE - Product Manager System
==========================================

This guide provides step-by-step instructions for deploying the Product Manager application.

SECTION 1: PREREQUISITES
========================

Required Software:
- Java Development Kit (JDK) 11 or higher
- Apache Maven 3.6.0 or higher
- Apache Tomcat 7.0 or higher
- MongoDB Atlas account with running cluster

Verification Commands:
java -version
mvn -version

SECTION 2: DATABASE SETUP (MongoDB Atlas)
==========================================

Step 1: Create MongoDB Atlas Account
- Visit https://www.mongodb.com/cloud/atlas
- Create free account
- Create organization and project

Step 2: Create Cluster
- Select Shared Clusters (free tier)
- Choose cloud provider (AWS, Google Cloud, Azure)
- Select region close to your location
- Create cluster (wait 2-3 minutes)

Step 3: Create Database User
- Go to "Database Access" tab
- Click "Add New Database User"
- Enter username and password
- Click "Add User"

Step 4: Whitelist IP Address
- Go to "Network Access" tab
- Click "Add IP Address"
- For development: Add 0.0.0.0/0 (accessible from anywhere)
- For production: Add specific IP addresses
- Click "Confirm"

Step 5: Create Database and Collection
- Go to "Collections" tab
- Click "Create Database"
- Database name: products
- Collection name: products
- Click "Create"

Step 6: Get Connection String
- Click "Connect" button
- Choose "Connect with Application"
- Select "Java" as driver
- Copy the connection string

Step 7: Update Application Configuration
- Open: src/main/resources/application.properties
- Find: mongodb.uri=
- Replace with your connection string:
  mongodb.uri=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority
- Save file

SECTION 3: BUILD PROJECT
========================

Method A: Using Build Script (Windows)
--------------------------------------
1. Open Command Prompt
2. Navigate to project root: cd path\to\wsJSP
3. Run: build.bat
4. Select option [1] for Clean and Build
5. Wait for build to complete

Method B: Using Maven Commands
-------------------------------
1. Open Command Prompt / Terminal
2. Navigate to project root
3. Run: mvn clean install
4. Wait for build to complete
5. Check target/product-manager.war file created

Output Files:
- target/product-manager.war (deployable WAR file)
- target/product-manager/ (exploded directory)

SECTION 4: DEPLOYMENT OPTIONS
=============================

OPTION A: Deploy to Running Tomcat
-----------------------------------

1. Locate Tomcat Installation
   - Default: C:\Program Files\Apache Software Foundation\Tomcat 9.0
   - Or set CATALINA_HOME environment variable

2. Deploy WAR File
   - Copy target/product-manager.war to CATALINA_HOME\webapps\
   - Tomcat will auto-extract the WAR

3. Restart Tomcat
   - Stop: CATALINA_HOME\bin\shutdown.bat
   - Start: CATALINA_HOME\bin\startup.bat
   - Or use Windows Services if installed

4. Verify Deployment
   - Open browser
   - Go to: http://localhost:8080/product-manager/jsp/form.jsp
   - Wait 10-15 seconds for first load

OPTION B: Run with Maven Tomcat Plugin (Development)
-----------------------------------------------------

1. Ensure MongoDB connection configured correctly

2. Open Command Prompt in project root

3. Run: mvn tomcat7:run

4. Wait for message: INFO: Server startup in [X] ms

5. Access application at: http://localhost:8080/product-manager/jsp/form.jsp

6. Stop: Press Ctrl+C in Command Prompt

OPTION C: Deploy Using WAR File
--------------------------------

1. Build WAR: mvn clean package

2. Copy WAR File
   - From: target/product-manager.war
   - To: CATALINA_HOME/webapps/

3. Start Tomcat

4. Monitor Tomcat logs
   - Location: CATALINA_HOME/logs/catalina.out

5. Access application after Tomcat shows: "deployment of web application directory [product-manager] has finished"

OPTION D: Deploy as Exploded WAR (Development)
-----------------------------------------------

1. Build: mvn clean install

2. Copy Directory
   - From: target/product-manager
   - To: CATALINA_HOME/webapps/

3. Rename to: product-manager (if needed)

4. Start Tomcat

5. Access application

SECTION 5: VERIFY DEPLOYMENT
============================

Access Points:
- Form Page: http://localhost:8080/product-manager/jsp/form.jsp
- Table Page: http://localhost:8080/product-manager/jsp/table.jsp

Test Checklist:
1. Navigate to form page
2. Verify CSS styling loads correctly
3. Fill out form with test data
4. Click "Add Product" button
5. Verify success message appears
6. Navigate to table page
7. Verify product appears in table
8. Test weight conversion display
9. Test search and filter functionality
10. Test delete product button

SECTION 6: INITIALIZE SAMPLE DATA (Optional)
==============================================

To populate database with sample products:

Method 1: Compile and Run DataInitializer
------------------------------------------
1. Navigate to project root
2. Compile: mvn compile
3. Run: mvn exec:java -Dexec.mainClass="com.products.util.DataInitializer"
4. Sample data will be inserted

Method 2: Insert via Application Form
--------------------------------------
1. Access form page
2. Fill form with product data
3. Click "Add Product"
4. Repeat for each product

SECTION 7: TROUBLESHOOTING
===========================

Problem: Cannot connect to MongoDB
Solution:
- Verify connection string in application.properties
- Check MongoDB Atlas cluster status (must be "Running")
- Confirm IP is whitelisted in Network Access
- Verify username and password

Problem: Application starts but pages not loading
Solution:
- Check Tomcat logs: CATALINA_HOME/logs/catalina.out
- Verify JSP files exist: webapps/product-manager/jsp/
- Clear browser cache (Ctrl+Shift+Delete)
- Restart Tomcat

Problem: Build fails with "Maven not found"
Solution:
- Install Maven from https://maven.apache.org/
- Add Maven bin directory to system PATH
- Restart Command Prompt
- Verify: mvn -version

Problem: Port 8080 already in use
Solution:
- Change port in pom.xml: <port>8081</port>
- Or stop other application using port 8080

Problem: 404 errors on page load
Solution:
- Verify deployment path is correct
- Check context path in web.xml
- Ensure WAR filename matches context path
- Access: http://localhost:8080/product-manager/

SECTION 8: PRODUCTION DEPLOYMENT
================================

Security Considerations:
- Use HTTPS instead of HTTP
- Restrict IP whitelist in MongoDB Atlas
- Use strong database credentials
- Enable MongoDB authentication
- Use environment variables for credentials
- Don't commit credentials to version control

Performance Optimization:
- Enable gzip compression in Tomcat
- Implement caching strategies
- Monitor MongoDB performance
- Use connection pooling
- Enable minification of CSS/JS files

Tomcat Configuration:
- Edit: CATALINA_HOME/conf/server.xml
- Add SSL connector for HTTPS
- Configure manager application
- Set up logging

SECTION 9: MONITORING
====================

Tomcat Logs:
Location: CATALINA_HOME/logs/
Files:
- catalina.out (main log)
- catalina.YYYY-MM-DD.log (daily log)
- localhost.log (application errors)

MongoDB Atlas Monitoring:
- Dashboard shows cluster metrics
- Monitor connections and operations
- Check replication status
- Review authentication logs

Application Logs:
- Via SLF4J/SL4J Simple
- Visible in Tomcat console/logs

SECTION 10: MAINTENANCE
=======================

Database Backup:
mongodump --uri "mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products"

Database Restore:
mongorestore --uri "mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products" ./dump/products

Update Connection String:
- Edit: src/main/resources/application.properties
- Rebuild: mvn clean install
- Redeploy WAR file

Upgrade Dependencies:
- Update version numbers in pom.xml
- Run: mvn clean install
- Test thoroughly before production

QUICK START COMMANDS
====================

Windows:
cd path\to\wsJSP
build.bat
Select option 2 to run immediately

Linux/Mac:
cd path/to/wsJSP
mvn clean tomcat7:run

Then access: http://localhost:8080/product-manager/jsp/form.jsp

SUPPORT
=======

For issues, check:
1. MongoDB connection configuration
2. Java version (11+)
3. Maven version (3.6+)
4. Tomcat version (7+)
5. Firewall/Network settings
6. Log files
7. Browser console errors

Documentation Files:
- README.md - Project overview
- MONGODB_SETUP.md - Database configuration
- DEPLOYMENT.md - This file
