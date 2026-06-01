# Controller API

This folder implements the controller API for **American Latin Class** using:

- **Slim 4** as the backend framework.
- **Eloquent ORM** as the ORM layer.
- **Supabase PostgreSQL** as the target database.
- **MVC-style organization** with literal top-level `Model`, `View`, and `Controller` folders.

The goal is to show that the project can move from static forms to a real API with models, routes, validation, authentication, role checks, and database entities.

## Main Features

- Public enrollment endpoint.
- Enrollment comments, national ID, email, and phone duplicate validation.
- Real login endpoint for teacher, student, and director accounts.
- Signed token authorization for internal routes.
- Required `APP_KEY` for token signing.
- Branch-scoped director permissions.
- Audit log support for protected write actions.
- Teacher attendance station for school-computer check-in.
- Monthly attendance endpoint for students.
- Student listing and director-managed student create/update/deactivation.
- Teacher listing and director-managed teacher create/update/deactivation.
- Teacher class planning endpoint with optional planning document URL.
- Student and teacher attendance endpoints.
- Teacher payroll summary at `$12` per class hour.
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

4. Generate an application key:

```powershell
C:\xampp\php\php.exe -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

Copy the generated value into `APP_KEY` in `.env`.

5. Add the Supabase PostgreSQL credentials in `.env`.

The local environment is already configured with a limited backend database role and the Supabase IPv4 pooler because this computer does not resolve the direct Supabase database host reliably.

6. Run `database/supabase_schema.sql` in Supabase SQL Editor.

If production has old Spanish alias users, run
`database/normalize_english_users.sql` afterward to keep academic login users
English-only.

7. Start the API:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t public
```

## Architecture

```text
public/index.php                 Application entry point
routes/api.php                   Route definitions and dependency composition
src/Controller                   HTTP controllers
../Model                         Eloquent models and relationships
../View                          Static frontend views
src/Service                      Object-oriented application services
src/Service/Validation           Request validation classes
src/Middleware                   Authentication and role checks
src/Support                      JSON/CORS/database infrastructure
tests                            Lightweight automated checks
```

The controller layer uses constructor injection so each class declares the exact collaborators it needs. Static business helpers were replaced by services such as `AuthService`, `BranchAccessService`, `AuditLogger`, `DateRangeService`, and validator classes.

## Local Checks

Without global PHP or Composer in PATH:

```powershell
C:\xampp\php\php.exe tests\lint.php
C:\xampp\php\php.exe tests\run.php
```

If Composer is available:

```powershell
composer run check
```

## Public Backend URL

Render production backend:

```text
https://american-latin-class.onrender.com
```

Health check:

```text
https://american-latin-class.onrender.com/api/health
```

This URL is deployed from GitHub with Render using `06Code/Dockerfile`.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check API and database status |
| GET | `/api/branches` | List branches |
| POST | `/api/enrollments` | Register a new enrollment request |
| POST | `/api/auth/login` | Login with stored user credentials |
| POST | `/api/teacher-attendance/check-in` | Register teacher check-in from the school station |
| GET | `/api/me` | Get current authenticated user profile |
| GET | `/api/me/attendance` | Get student monthly attendance |
| PATCH | `/api/me/photo` | Protected student profile photo update |
| GET | `/api/students` | Protected director student list |
| POST | `/api/students` | Protected director student creation |
| PATCH | `/api/students/{studentId}` | Protected director student update |
| DELETE | `/api/students/{studentId}` | Protected director student deactivation |
| GET | `/api/teachers` | Protected director teacher list |
| POST | `/api/teachers` | Protected director teacher creation |
| PATCH | `/api/teachers/{teacherId}` | Protected director teacher update |
| DELETE | `/api/teachers/{teacherId}` | Protected director teacher deactivation |
| GET | `/api/class-plans` | Protected teacher/director class plan list |
| POST | `/api/class-plans` | Protected teacher/director class plan |
| GET | `/api/attendance-records` | Protected teacher/director attendance records and teacher payroll summary |
| POST | `/api/attendance-records` | Protected teacher/director attendance |
| GET | `/api/professional-events` | Protected director event list |
| POST | `/api/professional-events` | Protected director event creation |
| POST | `/api/professional-events/{eventId}/assignments` | Protected B2 dancer assignment |
| GET | `/api/branch-finance-reports` | Protected director finance reports |
| POST | `/api/branch-finance-reports` | Protected director finance report creation |
| GET | `/api/dancer-settlements/{studentId}` | Protected B2 dancer payment summary |

## Local Verification

Verified for the current MVC backend with XAMPP PHP 8.2:

- `pdo_pgsql` and `pgsql` are enabled in `C:\xampp\php\php.ini`.
- Composer dependencies are installed in `vendor/`.
- `GET /api/health` returns `database: connected`.
- `GET /api/branches` returns Supabase branches.
- Render public backend is the current production API target.
- `GET /api/students` without token returns `401`.
- Login was tested with student and director accounts.
- Student monthly attendance was tested through `GET /api/me/attendance`.
- Teacher check-in is handled through `POST /api/teacher-attendance/check-in`.
- A protected backend flow was tested: login, student attendance, director student list, teacher records, class plans, attendance records, and finance reports.
- Test records were removed from Supabase after verification.

Current local API URL:

```text
http://127.0.0.1:8080/api/health
```
