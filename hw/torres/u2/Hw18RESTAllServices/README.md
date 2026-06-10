# Hw18 REST All Services

Complete REST CRUD service for the Computer Store customer collection.

Student: Carlos Alexander Torres Pincay  
Course: ESPE2604-AWD30716  

## Objective

Extend HW17 Customer Table with all REST services:

- `GET`: read customers.
- `POST`: create a customer.
- `PUT`: replace/update a full customer record.
- `PATCH`: partially update a customer record.
- `DELETE`: remove a customer.

## Class Database

The homework uses the MongoDB Atlas database provided by the professor:

```text
mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0
```

The app also supports `MONGODB_URI` from environment variables for AWS deployment.

## Run Locally

```powershell
npm install
npm start
```

Open:

```text
http://localhost:3016/
```

## Endpoints

```text
GET    /api/health
GET    /computerstore/customers
GET    /computerstore/customer/:id
GET    /computerstore/customers/totalSpent
POST   /computerstore/customer
PUT    /computerstore/customer/:id
PATCH  /computerstore/customer/:id
DELETE /computerstore/customer/:id
```

## Example Body

```json
{
  "id": 3016,
  "name": "Carlos Torres",
  "age": 24,
  "moneySpent": 180.75
}
```

## Demo Mode

If MongoDB Atlas blocks the local IP address, the app still starts with in-memory demo data. This keeps the browser evidence available. On AWS, set `MONGODB_URI` and whitelist the AWS public IP in MongoDB Atlas if the professor requires real database writes.

## Additional Documentation

- `docs/AWS_EC2_DEPLOYMENT.md`
- `docs/PROBLEM_SOLUTION_STEPS.md`
