# WS14 REST Web Services

REST API built with Express and Mongoose for the Computer Store customer collection.

## Run

```powershell
npm install
npm start
```

By default the workshop uses the shared class MongoDB URI from the reference projects. To use a private database, create `.env` from `.env.example` and set `MONGODB_URI`.

## Endpoints

```text
GET /computerstore/customers
GET /computerstore/customer/:id
```

Local URL:

```text
http://localhost:3016/
```
