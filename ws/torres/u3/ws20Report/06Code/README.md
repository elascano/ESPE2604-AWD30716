# Code

Main source code for **American Latin Class**.

## Current Structure

The active application is split into two runtime folders:

- `backend`: PHP 8.2 Slim 4 API with Eloquent ORM and Supabase PostgreSQL.
- `frontend`: static HTML/CSS/JavaScript site for Netlify or any static host.

The repository used to describe the app as `Model`, `View`, and `Controller` folders. That is no longer the physical layout. MVC-style separation now exists inside the backend source tree and through the backend/frontend boundary.

## Folder Guide

| Path | Purpose |
| --- | --- |
| `backend/composer.json` | Backend dependencies and scripts. |
| `backend/public/index.php` | Slim HTTP entry point, CORS, error middleware, and route loading. |
| `backend/routes/api.php` | Route table and dependency composition. |
| `backend/src/Controllers` | HTTP controllers. |
| `backend/src/Models` | Eloquent models for Supabase tables. |
| `backend/src/Services` | Application services, validation, JWT, payroll, dates, audit, and branch access rules. |
| `backend/src/Middleware` | Role-based authentication middleware. |
| `backend/src/Support` | Database bootstrapping and JSON response helpers. |
| `backend/database/schema.sql` | Current Supabase PostgreSQL schema and seed data. |
| `backend/tests` | Lightweight PHP lint/test scripts. |
| `frontend/*.html` | Public pages, login, dashboard, pricing, enrollment, and teacher kiosk. |
| `frontend/css/styles.css` | Visual styling and responsive layout. |
| `frontend/js` | Frontend classes for config, API calls, session, public pages, dashboard, validation, and formatting. |
| `Dockerfile` | Backend Docker image used by Render when the root directory is `06Code`. |
| `docker-entrypoint.sh` | Runtime `.env` creation and PHP server startup inside the container. |
| `render.yaml` | Render blueprint draft for backend and static frontend services. |

## Backend Scripts

Run these commands from `06Code/backend` after installing Composer dependencies:

```powershell
composer install
composer run lint
composer run test
composer run check
composer run start
```

If `php` and `composer` are not in the system PATH, use XAMPP PHP explicitly and install Composer first.

## Local Development

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill `APP_KEY`, Supabase database credentials, `FRONTEND_ORIGINS`, and optional `GOOGLE_CLIENT_ID`.
3. Run `backend/database/schema.sql` in Supabase SQL Editor or against a compatible local PostgreSQL database.
4. Start the backend:

```powershell
cd 06Code\backend
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t public
```

5. Serve `06Code/frontend` with any static server.

For the frontend, `frontend/js/config.js` may set:

```js
window.API_BASE_URL = "http://127.0.0.1:8080";
window.GOOGLE_CLIENT_ID = "";
```

## Design Notes

- Controllers coordinate HTTP requests and responses.
- Services contain reusable business rules such as authentication, branch access, date ranges, audit logging, payroll, and attendance summaries.
- `ValidationService` currently centralizes request validation.
- Models stay focused on database mapping and relationships.
- The frontend uses vanilla JavaScript classes so the static deploy remains simple.
- Historical `hw`, `ws`, `exams`, and copied delivery folders live outside `06Code`, mostly under `07Other`.
