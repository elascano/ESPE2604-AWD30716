# Hw18 REST All Services Evidence

Student: Carlos Alexander Torres Pincay  
Date: 2026-06-08

## Browser Evidence

- `hw18-dashboard.png`: running dashboard with customer list, total, service mode, and CRUD actions.
- `hw18-health.png`: `/api/health` JSON response.

## Local Test Result

The service ran locally at:

```text
http://localhost:3016/
```

MongoDB Atlas did not accept the local IP address during the test, so the service used demo mode. CRUD behavior was still verified through the same REST routes.

## REST Methods Verified

```text
GET    /computerstore/customers
GET    /computerstore/customer/4018
POST   /computerstore/customer
PUT    /computerstore/customer/4018
PATCH  /computerstore/customer/4018
DELETE /computerstore/customer/4018
GET    /computerstore/customers/totalSpent
```

## Verified Sequence

```text
GET customers before
POST customer 4018
GET customer 4018
PUT customer 4018
PATCH customer 4018
GET total spent
DELETE customer 4018
GET customers after
```

## Health Response

```json
{
  "status": "ok",
  "app": "Hw18RESTAllServices",
  "author": "Carlos Alexander Torres Pincay",
  "database": "demo"
}
```
