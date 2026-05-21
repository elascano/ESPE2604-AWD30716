# Product Storage PHP - Render Deployment

This project is a PHP MVC-style version of Product Storage.

It uses:

- PHP 8.3
- Apache
- PDO
- PostgreSQL
- Supabase PostgreSQL
- Docker
- Render Web Service

It does not use Supabase REST API.

## Required Render environment variables

Configure these variables in Render:

```text
SUPABASE_DB_HOST=aws-1-us-west-1.pooler.supabase.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.YOUR_PROJECT_REF
SUPABASE_DB_PASSWORD=YOUR_PASSWORD
APP_ENV=production
APP_DEBUG=false
```

Recommended Supabase port:

```text
5432
```

Avoid using the transaction pooler port `6543` for this small MVC-style project.

## Local execution with Docker

```bash
docker build -t product-storage-php .
docker run --rm -p 8080:80 ^
    -e SUPABASE_DB_HOST=your-host ^
    -e SUPABASE_DB_PORT=5432 ^
    -e SUPABASE_DB_NAME=postgres ^
    -e SUPABASE_DB_USER=postgres.your-project-ref ^
    -e SUPABASE_DB_PASSWORD=your-password ^
    product-storage-php
```

Open:

```text
http://localhost:8080
```

## Routes

```text
GET  /products/create
POST /products/store
GET  /products
POST /products/update
POST /products/delete
```

Edit and delete are handled through modals on the Product List page.
