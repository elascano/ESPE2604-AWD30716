# HW15 URI's V2 - American Latin Class

Student: Carlos Alexander Torres Pincay  
Project teammate: Evelyn Villarreal  
Project: American Latin Class  
Date: 2026-06-08

## Purpose

Document the current RESTful URI design of American Latin Class and add complementary URI proposals that can be assigned to Carlos without repeating the same route set used by another teammate.

## Current Backend Base

```text
Local backend: http://localhost:8080
Production backend: https://american-latin-class.onrender.com
API prefix: /api
```

## Current Implemented Routes

| Method | URI | Resource / workflow | Access |
| --- | --- | --- | --- |
| GET | `/` | API index | Public |
| GET | `/api/health` | Health check | Public |
| GET | `/api/debug` | Environment debug | Technical |
| GET | `/api/branches` | Branch catalog | Public |
| GET | `/api/styles` | Dance style catalog | Public |
| GET | `/api/levels` | Level catalog | Public |
| POST | `/api/enrollments` | Enrollment request | Public |
| POST | `/api/auth/login` | Email/password login | Public |
| POST | `/api/auth/google` | Google login | Public |
| POST | `/api/auth/google/register` | Google account registration | Public |
| POST | `/api/auth/google/enroll` | Google enrollment | Public |
| POST | `/api/kiosk/attendance` | Student kiosk attendance | Public |
| POST | `/api/teacher-attendance/check-in` | Teacher check-in | Public |
| GET | `/api/me` | Current authenticated profile | Student, teacher, director |
| GET | `/api/me/attendance` | Student own attendance | Student |
| PATCH | `/api/me/photo` | Student profile photo | Student |
| GET | `/api/students` | Student list | Director |
| POST | `/api/students` | Student creation | Director |
| PATCH | `/api/students/{studentId}` | Student update | Director |
| DELETE | `/api/students/{studentId}` | Student deactivation | Director |
| GET | `/api/teachers` | Teacher list | Director |
| POST | `/api/teachers` | Teacher creation | Director |
| PATCH | `/api/teachers/{teacherId}` | Teacher update | Director |
| DELETE | `/api/teachers/{teacherId}` | Teacher deactivation | Director |
| GET | `/api/class-plans` | Class plan list | Teacher, director |
| POST | `/api/class-plans` | Class plan creation | Teacher, director |
| GET | `/api/attendance-records` | Attendance record list | Teacher, director |
| POST | `/api/attendance-records` | Attendance record creation | Teacher, director |
| GET | `/api/branch-finance-reports` | Branch finance report list | Director |
| POST | `/api/branch-finance-reports` | Branch finance report creation | Director |
| GET | `/api/professional-events` | Professional event list | Director |
| POST | `/api/professional-events` | Professional event creation | Director |
| POST | `/api/professional-events/{eventId}/assignments` | Dancer assignment | Director |
| GET | `/api/dancer-settlements/{studentId}` | Dancer settlement | Director |

## Carlos Complementary URI Set

These ten proposed URIs are intentionally different from a simple existing-route catalog. They extend the same ALC domain and can become future project tasks.

| Method | Proposed URI | Purpose |
| --- | --- | --- |
| GET | `/api/branches/{branchId}/attendance-summary` | Monthly attendance summary by branch. |
| GET | `/api/students/{studentId}/progress` | Student progress across levels and attendance. |
| GET | `/api/students/{studentId}/class-plans` | Class plans assigned to one student. |
| GET | `/api/teachers/{teacherId}/payroll-summary` | Payroll summary for a teacher and month. |
| GET | `/api/teachers/{teacherId}/attendance-history` | Teacher attendance history. |
| GET | `/api/class-plans/{classPlanId}/attendance-records` | Attendance records tied to one class plan. |
| GET | `/api/professional-events/{eventId}/participants` | Dancers assigned to one professional event. |
| GET | `/api/professional-events/{eventId}/settlement-summary` | Event-level dancer settlement totals. |
| GET | `/api/dashboard/director-summary` | Director dashboard totals in one request. |
| GET | `/api/audit-logs` | Administrative audit log for tracked actions. |

## Design Notes

- Use plural nouns for collections.
- Use IDs only when targeting one resource.
- Use query parameters for dates, status, branch, and pagination.
- Keep workflow endpoints, such as login or check-in, under clear action-oriented groups.
- Keep student self-service routes under `/api/me`.
