# Exam CRUD — Neon PostgreSQL

Servicio de persistencia. Es el único componente que se conecta a Neon.

## Modelo

```text
Item
├── id
├── name
├── price
├── stock
├── expiration_date
└── created_at
```

## Endpoints

```text
GET    /items
GET    /items/search?q=texto
GET    /items/{item_id}
POST   /items
PUT    /items/{item_id}
DELETE /items/{item_id}
```

Swagger:

```text
http://HOST_CRUD:3000/docs
```

## Configuración

```bash
cp .env.example .env
```

Completa las dos cadenas de Neon y levanta:

```bash
docker compose up -d --build
curl http://localhost:3000/health
```

## Migración desde la versión con `expiration_days`

Si la tabla `items` ya existe en Neon con datos de la versión anterior, ejecuta primero en el SQL Editor de Neon:

```sql
ALTER TABLE items
ADD COLUMN IF NOT EXISTS expiration_date DATE;

UPDATE items
SET expiration_date = CURRENT_DATE + COALESCE(expiration_days, 30)
WHERE expiration_date IS NULL;

ALTER TABLE items
ALTER COLUMN expiration_date SET NOT NULL;

ALTER TABLE items
DROP COLUMN IF EXISTS expiration_days;
```

Después ejecuta normalmente:

```bash
docker compose up -d --build
```

Si la tabla aún no existe, no necesitas ejecutar el SQL: `prisma db push` la crea directamente.
