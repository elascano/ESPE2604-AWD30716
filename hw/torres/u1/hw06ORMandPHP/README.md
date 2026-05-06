# HW06 - ORM and PHP

This assignment implements the first backend API for **American Latin Class** using:

- **Slim 4** as the backend framework.
- **Eloquent ORM** as the ORM layer.
- **Supabase PostgreSQL** as the target database.

The goal is to show that the project can move from static forms to a real API with models, routes, validation, and database entities.

## Main Features

- Public enrollment endpoint.
- Student listing by branch, level, and scholarship status.
- Teacher class planning endpoint.
- Student and teacher attendance endpoint.
- Professional B2 event endpoint.
- B2 dancer event assignment endpoint.
- Automatic dancer settlement calculation for paid events, penalties, and deductions.

## Setup

1. Enable PostgreSQL support in XAMPP PHP:

```ini
extension=pdo_pgsql
extension=pgsql
```

2. Install dependencies:

```powershell
composer install
```

If Composer is not installed globally, download `composer.phar` from Composer's official website and run:

```powershell
C:\xampp\php\php.exe composer.phar install
```

3. Copy the environment file:

```powershell
Copy-Item .env.example .env
```

4. Add the Supabase PostgreSQL credentials in `.env`.

The local environment is already configured with a limited backend database role and the Supabase IPv4 pooler because this computer does not resolve the direct Supabase database host reliably.

5. Run `database/supabase_schema.sql` in Supabase SQL Editor.

6. Start the API:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t public
```

## Public Backend URL

Railway production backend:

```text
https://american-latin-class-backend-production.up.railway.app
```

Health check:

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

This URL is deployed from the local backend folder using Railway CLI. No Git repository was used for the deployment.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check API and database status |
| GET | `/api/branches` | List branches |
| GET | `/api/students` | List students with optional filters |
| POST | `/api/enrollments` | Register a new enrollment request |
| POST | `/api/class-plans` | Save a teacher monthly class plan |
| POST | `/api/attendance-records` | Save student or teacher attendance |
| GET | `/api/professional-events` | List professional events |
| POST | `/api/professional-events` | Create a professional event |
| POST | `/api/professional-events/{eventId}/assignments` | Assign a B2 dancer to a paid professional event |
| GET | `/api/branch-finance-reports` | List branch monthly finance reports |
| POST | `/api/branch-finance-reports` | Create branch monthly finance report |
| GET | `/api/dancer-settlements/{studentId}` | Calculate B2 dancer payment summary |

## Local Verification

Verified on May 3, 2026 with XAMPP PHP 8.2:

- `pdo_pgsql` and `pgsql` are enabled in `C:\xampp\php\php.ini`.
- Composer dependencies are installed in `vendor/`.
- `GET /api/health` returns `database: connected`.
- `GET /api/branches` returns 5 Supabase branches.
- Railway public backend returns 5 Supabase branches.
- A full backend flow was tested: enrollment, class plan, attendance, professional event, B2 event assignment, finance report, and dancer settlement.
- Test records were removed from Supabase after verification.

Current local API URL:

```text
http://127.0.0.1:8080/api/health
```
