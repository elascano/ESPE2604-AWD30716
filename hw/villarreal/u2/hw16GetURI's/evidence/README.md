# HW16 Browser Evidence

Student: Carlos Alexander Torres Pincay

Project: American Latin Class

Date: 2026-06-09

## Captured URLs

| Screenshot | URL | Result |
| --- | --- | --- |
| `hw16-uri-api-index.png` | `https://american-latin-class.onrender.com/` | API index returned project metadata and endpoint lists. |
| `hw16-uri-health.png` | `https://american-latin-class.onrender.com/api/health` | Endpoint responded, but database status is `not connected` in the deployed backend. |
| `hw16-uri-protected-me.png` | `https://american-latin-class.onrender.com/api/me` | Protected GET URI responded with `Authentication required`, confirming route protection. |

## Execution Notes

The local PHP backend could not be started on this Windows workstation because the `php` command is not installed. For browser evidence, the deployed Render backend was used instead.

The `/api/health` response is useful evidence, but it also shows that the deployed American Latin Class backend needs database credentials configured before database-backed public endpoints can return successful data.
