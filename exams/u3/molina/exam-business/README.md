# Exam Business — IVA y días restantes

Business recibe las peticiones del frontend y se comunica por HTTP con CRUD.

## Configuración

```env
PORT=3001
CRUD_API_URL=http://IP_PRIVADA_CRUD:3000
VAT_RATE=0.15
```

## Endpoints

```text
GET    /api/v1/items
GET    /api/v1/items/{item_id}
POST   /api/v1/items
PUT    /api/v1/items/{item_id}
DELETE /api/v1/items/{item_id}
GET    /api/v1/items/iva?q=texto
GET    /api/v1/items/dias-restantes?q=texto
```

### IVA

```http
GET /api/v1/items/iva?q=apple
```

Devuelve por cada coincidencia:

```text
iva_rate
iva_value
price_with_iva
```

### Días restantes

```http
GET /api/v1/items/dias-restantes?q=apple
```

Devuelve:

```text
expiration_date
days_remaining
```

Un valor negativo de `days_remaining` significa que el producto ya expiró.

Swagger:

```text
http://HOST_BUSINESS:3001/docs
```
