# MongoDB Atlas Configuration

## Connection String Format
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

## Setup Steps

1. Create MongoDB Atlas Account
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. Create Organization and Project
   - Create a new organization
   - Create a new project

3. Create Cluster
   - Choose "Shared Clusters" for free tier
   - Select cloud provider and region
   - Complete cluster creation (may take 2-3 minutes)

4. Configure Database Access
   - Go to "Database Access" section
   - Add new database user
   - Remember username and password

5. Configure Network Access
   - Go to "Network Access"
   - Add IP Address (use 0.0.0.0/0 for development, restrict for production)
   - Click "Confirm"

6. Create Database and Collection
   - Go to "Collections"
   - Create database named "products"
   - Create collection named "products"

7. Get Connection String
   - Click "Connect" button
   - Choose "Connect with application"
   - Copy connection string
   - Replace <username>, <password>, and add database name

## Example Connection String
mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/products?retryWrites=true&w=majority

## Environment Variable (Optional)
export MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products?retryWrites=true&w=majority"

## Test Connection
Use MongoDB Compass (GUI tool) to test connection:
1. Download MongoDB Compass from mongodb.com
2. Paste connection string
3. Click "Connect"

## Document Structure Example
{
  "_id": ObjectId(),
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

## Index Recommendation
db.products.createIndex({ "name": 1 })
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "barcode": 1 })

## Common Issues

1. Connection timeout
   - Check IP whitelist
   - Verify connection string
   - Ensure cluster is running

2. Authentication failed
   - Verify username and password
   - Check for special characters in password (URL encode if needed)

3. Database not found
   - Verify database name exists
   - Create database if missing

## MongoDB Query Examples

Get all products:
db.products.find()

Get product by name:
db.products.findOne({ name: "Product Name" })

Get products by category:
db.products.find({ category: "Electronics" })

Update product:
db.products.updateOne({ _id: ObjectId("...") }, { $set: { price: 199.99 } })

Delete product:
db.products.deleteOne({ _id: ObjectId("...") })

Count products:
db.products.countDocuments()

## Backup and Restore

Backup collections:
mongodump --uri "mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products"

Restore collections:
mongorestore --uri "mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/products" ./dump/products
