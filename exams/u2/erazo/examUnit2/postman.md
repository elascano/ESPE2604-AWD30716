# Cellphone API — Postman Requests

Use two base URLs after deployment:

- `CELLPHONE_BASE_URL` = `CellphoneApiUrl`
- `BUSINESS_BASE_URL` = `BusinessApiUrl`

---

## Cellphone API (Backend 1)

### 1. Create Cellphone

`POST {{CELLPHONE_BASE_URL}}/api/cellphone`

Headers:
```http
Content-Type: application/json
```

Body:
```json
{
  "serial_number": "SN-001",
  "price": 599.99,
  "model": "Galaxy S25",
  "year_launched": 2025,
  "brand": "Samsung",
  "camera_quality": "great"
}
```

### 2. List All Cellphones

`GET {{CELLPHONE_BASE_URL}}/api/cellphone`

No headers required.

---

## Business API (Backend 2)

### 3. Sort by Price Ascending

`GET {{BUSINESS_BASE_URL}}/api/cellphone/priceSortedAscendent`

No headers required.

### 4. Sort by Price Descending

`GET {{BUSINESS_BASE_URL}}/api/cellphone/priceSortedDescendent`

No headers required.

### 5. Count All Cellphones

`GET {{BUSINESS_BASE_URL}}/api/cellphone/count`

No headers required.

---

## Suggested Environment Variables in Postman

```text
CELLPHONE_BASE_URL=https://your-cellphone-api-url.execute-api.region.amazonaws.com
BUSINESS_BASE_URL=https://your-business-api-url.execute-api.region.amazonaws.com
```

## Quick Test Flow

1. Create 2–3 cellphones via `POST /api/cellphone`
2. List all via `GET /api/cellphone`
3. Sort ascending via `GET /api/cellphone/priceSortedAscendent`
4. Sort descending via `GET /api/cellphone/priceSortedDescendent`
5. Count via `GET /api/cellphone/count`
