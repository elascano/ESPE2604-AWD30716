# HW16 Get URI's - American Latin Class

Student: Carlos Alexander Torres Pincay  
Project: American Latin Class  
Date: 2026-06-08

## Purpose

Document the GET routes available in the current American Latin Class backend and identify useful query examples for browser/API evidence.

## Current GET Routes

| URI | Purpose | Evidence expectation |
| --- | --- | --- |
| `/` | API index | Returns project metadata and endpoint groups. |
| `/api/health` | Health check | Returns API/database status. |
| `/api/debug` | Environment debug | Returns environment variable status for troubleshooting. |
| `/api/branches` | Branch catalog | Returns branch records. |
| `/api/styles` | Dance style catalog | Returns dance style records. |
| `/api/levels` | Level catalog | Returns level records. |
| `/api/me` | Authenticated profile | Requires bearer token. |
| `/api/me/attendance` | Student attendance | Requires student token. |
| `/api/students` | Student list | Requires director token. |
| `/api/teachers` | Teacher list | Requires director token. |
| `/api/class-plans` | Class plans | Requires teacher or director token. |
| `/api/attendance-records` | Attendance records | Requires teacher or director token. |
| `/api/branch-finance-reports` | Finance reports | Requires director token. |
| `/api/professional-events` | Professional events | Requires director token. |
| `/api/dancer-settlements/{studentId}` | Dancer settlements | Requires director token. |

## Query Examples

```text
GET /api/students?branchId=1
GET /api/students?status=active
GET /api/teachers?branchId=2
GET /api/class-plans?branchId=1&from=2026-06-01&to=2026-06-30
GET /api/attendance-records?month=2026-06
GET /api/branch-finance-reports?month=2026-06
GET /api/professional-events?status=scheduled
GET /api/me/attendance?month=2026-06
```

## Carlos Complementary GET URI Proposals

| Proposed URI | Reason |
| --- | --- |
| `/api/branches/{branchId}/attendance-summary?month=2026-06` | One branch attendance KPI endpoint. |
| `/api/students/{studentId}/progress` | Student progress evidence. |
| `/api/students/{studentId}/payments` | Payment/account status for a student. |
| `/api/teachers/{teacherId}/payroll-summary?month=2026-06` | Teacher payroll evidence. |
| `/api/teachers/{teacherId}/attendance-history?month=2026-06` | Teacher check-in evidence. |
| `/api/class-plans/{classPlanId}/attendance-records` | Connect planning with attendance. |
| `/api/professional-events/{eventId}/participants` | Event participant evidence. |
| `/api/professional-events/{eventId}/settlement-summary` | Event finance evidence. |
| `/api/dashboard/director-summary?month=2026-06` | Reduce multiple dashboard calls. |
| `/api/audit-logs?entity=students&from=2026-06-01` | Administrative traceability. |

## Manual Browser Evidence Checklist

1. Start the backend.
2. Open `/api/health`.
3. Open `/api/branches`, `/api/styles`, and `/api/levels`.
4. Login as a valid user for protected routes.
5. Capture browser screenshots for successful JSON responses.

## Generated Deliverables

- Word document: `HW16_GET_URIS_Carlos_Torres.docx`
- Browser evidence folder: `evidence/`
- Captured deployed backend URLs:
  - `https://american-latin-class.onrender.com/`
  - `https://american-latin-class.onrender.com/api/health`
  - `https://american-latin-class.onrender.com/api/me`

Note: the local PHP backend could not be executed on this workstation because PHP is not installed. The browser screenshots were captured from the deployed Render backend.
