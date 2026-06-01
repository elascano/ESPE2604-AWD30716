# Code

Main source code for **American Latin Class**.

## MVC Structure

- `Model`: Eloquent entities and relationships for Supabase tables.
- `View`: public website, enrollment, attendance kiosk, login, and role dashboards.
- `Controller`: Slim API entry point, route table, controllers, middleware, services, validation, and support classes.

## Folder Guide

| Path | Purpose |
| --- | --- |
| `Model/` | Eloquent models. |
| `View/` | Static frontend deployed on Netlify. |
| `View/script/` | Frontend classes and API configuration. |
| `Controller/public/` | Render backend entry point. |
| `Controller/routes/` | Route map and dependency composition. |
| `Controller/src/Controller/` | HTTP controllers. |
| `Controller/src/Service/` | Application services and business rules. |
| `Controller/src/Service/Validation/` | Request validators. |
| `Controller/database/` | Supabase schema and data maintenance scripts. |
| `Controller/tests/` | Backend checks. |

## Code Style

- Controllers coordinate HTTP requests and responses.
- Services contain business rules such as authentication, branch access, date ranges, audit logging, and attendance summaries.
- Validators live in `Controller/src/Service/Validation`.
- Models stay focused on database mapping and relationships.
- The frontend uses vanilla JavaScript organized into classes, so the Netlify deploy remains simple while the code follows POO.

Historical `hw`, `ws`, `exams`, and evidence delivery folders live outside this active source folder, so `06Code` opens directly on the MVC project.
