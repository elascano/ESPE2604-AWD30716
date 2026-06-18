# Use the official Tomcat image with Java 11/17 compatibility
FROM tomcat:9.0-jdk11-openjdk-slim

# Clear default Tomcat apps so your project is the only one running
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy your specific WAR file and rename it to ROOT.war
# This forces Render to open your app directly at the main link (e.g., yoursite.onrender.com)
COPY StoreProductsMVC-1.0.war /usr/local/tomcat/webapps/ROOT.war

# Expose Tomcat's default internal port
EXPOSE 8080

# Tells Tomcat to dynamically adapt to the network port Render assigns it
CMD ["sh", "-c", "sed -i 's/port=\"8080\"/port=\"'\"$PORT\"'\"/g' /usr/local/tomcat/conf/server.xml && catalina.sh run"]