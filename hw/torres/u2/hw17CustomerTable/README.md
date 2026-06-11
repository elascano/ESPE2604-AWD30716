# HW17 Customer Table

Customer table homework adapted for Carlos Alexander Torres Pincay.

## Stack

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- HTML, CSS, and JavaScript

## Run

```powershell
npm install
npm start
```

Open:

```text
http://localhost:3017/
```

## API

```text
GET /api/health
GET /customerStore/customer
GET /customerStore/customer/count
GET /customerStore/customer/revenue
GET /customerStore/customer/summary
GET /customerStore/customer/:id
GET /customerStore/customer/name/:name
GET /customerStore/customer/age/:age
```

The default MongoDB connection uses the shared class URI found in the reference workshops. To use a private database, create `.env` from `.env.example`.

If MongoDB is unavailable during a classroom demo, the app still starts and shows demo customer data so browser evidence can be captured.
