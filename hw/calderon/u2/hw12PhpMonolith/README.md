# PHP + Vue + Supabase + RedBean MVC

Example web application without a REST API: PHP serves the MVC pages, forms submit regular `POST` requests to the controller, RedBean reads and writes data in Supabase Postgres, and Vue is used in the views for the user interface.

## 1. Create the Supabase table

Open the Supabase SQL Editor and run:

```sql
create table if not exists employee (
  id bigserial primary key,
  employee_id varchar(80) not null unique,
  name varchar(160) not null,
  address varchar(220) not null,
  cellphone varchar(40) not null,
  email varchar(180) not null,
  salary numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
```

## 2. Configure credentials

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your Supabase database details.

## 3. Add RedBean without Composer

Copy your `rb.php` file into one of these paths:

```text
vendor/rb.php
vendor/gabordemooij/redbean/rb.php
lib/rb.php
rb.php
```

The recommended path for this project is:

```text
lib/rb.php
```

If you want to use another location, set `REDBEAN_FILE` in `.env` with the absolute path to the file.

If PHP does not have PostgreSQL enabled, enable `pdo_pgsql` and `pgsql` in `php.ini`.

## 4. Run locally

```powershell
php -S localhost:8000 -t public
```

Open:

- `http://localhost:8000/employees/create` to register employees.
- `http://localhost:8000/employees` to view the table and total salaries.

## MVC structure

- `public/index.php`: front controller and routes.
- `app/Controllers/EmployeeController.php`: receives requests and selects the response.
- `app/Models/Employee.php`: data access using RedBean.
- `app/Views`: HTML/PHP with Vue mounted in each page.
- `app/Core`: configuration, database, and view helpers.

## Deploy to Render with Docker

1. Copy `rb.php` to `lib/rb.php` and commit it to the repository.
2. Create a Docker Web Service in Render.
3. Configure these environment variables:

```text
APP_ENV=production
APP_DEBUG=false
SUPABASE_DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:your_database_password@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres?sslmode=require
```

You can also use separate variables:

```text
APP_ENV=production
APP_DEBUG=false
SUPABASE_DB_HOST=aws-0-YOUR_REGION.pooler.supabase.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.YOUR_PROJECT_REF
SUPABASE_DB_PASSWORD=your_database_password
SUPABASE_DB_SSLMODE=require
```

Use Supabase's Session Pooler connection string if Render cannot connect through the direct IPv6 connection.
