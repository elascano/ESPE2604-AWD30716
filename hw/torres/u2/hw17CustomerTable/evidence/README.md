# HW17 Customer Table - Browser Evidence

Student: Carlos Alexander Torres Pincay  
Date: 2026-06-08

## Test Environment

```text
App path: hw/torres/u2/hw17CustomerTable
Local URL: http://localhost:3017/
Browser: Google Chrome headless
Runtime: Node.js
```

## Result

The homework ran in the browser and served the customer table successfully.

MongoDB Atlas rejected the local IP during the run, so the app used its classroom demo-data fallback. The fallback keeps the browser evidence available while preserving the MongoDB implementation for real database access.

## Evidence Files

| File | Evidence |
| --- | --- |
| `hw17-dashboard.png` | Running browser dashboard with customer rows, totals, and API status. |
| `hw17-health.png` | `/api/health` returned a valid JSON response. |
| `hw17-customer-101.png` | `/customerStore/customer/101` returned a valid customer JSON response. |

## Verified Endpoints

```text
GET /api/health
GET /customerStore/customer
GET /customerStore/customer/count
GET /customerStore/customer/101
```

## Observed Responses

```json
{"status":"ok","app":"HW17 Customer Table","author":"Carlos Alexander Torres Pincay"}
```

```json
{"id":101,"name":"Carlos Torres","age":24,"moneySpent":420}
```
