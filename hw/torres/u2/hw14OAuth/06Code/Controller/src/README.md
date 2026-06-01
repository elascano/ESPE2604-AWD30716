# Backend Source Map

This folder contains the object-oriented source code used by the Slim backend.

| Folder | Responsibility |
| --- | --- |
| `Controller/` | HTTP controllers. They coordinate requests and responses. |
| `Middleware/` | Route protection and role-based access. |
| `Service/` | Reusable business rules and application services. |
| `Support/` | Infrastructure helpers for JSON responses and database setup. |

Controllers should stay small. Reusable validation, calculations, access checks, and formatting belong in services or validators.
