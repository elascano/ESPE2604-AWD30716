# Implemented Features Evidence

This document confirms that the three selected project features are not only written as requirements. They are also implemented in the project folders for HW06 and HW08.

Production frontend URL:

```text
https://creative-pothos-6c7a4c.netlify.app
```

Connected Supabase project:

```text
https://luzlnnndzhpilgxacnim.supabase.co
```

Public backend review URL:

```text
https://american-latin-class-backend-production.up.railway.app
```

Backend health check:

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

## Feature 1: Public Landing and Enrollment

Implemented in:

- `../hw08Front-EndFrameworks/index.html`
- `../hw08Front-EndFrameworks/enrollment.html`
- `../hw08Front-EndFrameworks/script/app.js`
- `../hw08Front-EndFrameworks/css/styles.css`
- `programmed-features/hw08-front-end-copy/index.html`
- `programmed-features/hw08-front-end-copy/enrollment.html`
- `programmed-features/hw08-front-end-copy/script/app.js`
- `programmed-features/hw08-front-end-copy/css/styles.css`
- `../hw06ORMandPHP/public/index.php`
- `../hw06ORMandPHP/src/Models/Student.php`

Implemented behavior:

- Public home page for visitors with academy information.
- Separate enrollment page and form for new students.
- Branch, B1/B2 level, scholarship percentage, and guardian data capture.
- Local functional demo with `localStorage`.
- Supabase insert through the deployed frontend.
- Backend endpoint: `POST /api/enrollments`.

## Feature 2: Student, Scholarship, and Attendance Control

Implemented in:

- `../hw08Front-EndFrameworks/login.html`
- `../hw08Front-EndFrameworks/dashboard.html`
- `../hw08Front-EndFrameworks/script/app.js`
- `programmed-features/hw08-front-end-copy/login.html`
- `programmed-features/hw08-front-end-copy/dashboard.html`
- `programmed-features/hw08-front-end-copy/script/app.js`
- `../hw06ORMandPHP/public/index.php`
- `../hw06ORMandPHP/src/Models/Student.php`
- `../hw06ORMandPHP/src/Models/AttendanceRecord.php`
- `../hw06ORMandPHP/src/Models/ClassPlan.php`

Implemented behavior:

- Single login page for teachers, students, and directors.
- Role-based dashboard modules after login.
- Student table with branch, B1/B2 level, scholarship percentage, and status.
- Parent/student follow-up section.
- Teacher monthly class planning form.
- Student and teacher attendance form.
- Attendance evidence code generation.
- Backend endpoints: `GET /api/students`, `POST /api/class-plans`, and `POST /api/attendance-records`.

## Feature 3: Branch Finance and Professional Dancer Agency

Implemented in:

- `../hw08Front-EndFrameworks/login.html`
- `../hw08Front-EndFrameworks/dashboard.html`
- `../hw08Front-EndFrameworks/script/app.js`
- `programmed-features/hw08-front-end-copy/login.html`
- `programmed-features/hw08-front-end-copy/dashboard.html`
- `programmed-features/hw08-front-end-copy/script/app.js`
- `../hw06ORMandPHP/public/index.php`
- `../hw06ORMandPHP/src/Models/BranchFinanceReport.php`
- `../hw06ORMandPHP/src/Models/ProfessionalEvent.php`
- `../hw06ORMandPHP/src/Models/DancerEventAssignment.php`

Implemented behavior:

- Director dashboard with administrative modules separated from the public site.
- Branch income and expense registration.
- Matrix share percentage calculation.
- Main branch reserve update.
- B2 professional event registration.
- Dancer event history.
- Automatic gross amount, deductions, and net payment calculation.
- Backend endpoints: `GET /api/branch-finance-reports`, `POST /api/branch-finance-reports`, `GET /api/professional-events`, `POST /api/professional-events`, `POST /api/professional-events/{eventId}/assignments`, and `GET /api/dancer-settlements/{studentId}`.

## Backend Verification

The frontend is functional immediately because it uses local demo storage, and the deployed version is connected to Supabase for form inserts. The public home, enrollment form, login, and role dashboards are separated into different pages so the system is modular.

The PHP backend is also configured and tested locally:

- Framework: Slim 4.
- ORM: Eloquent ORM.
- Database: Supabase PostgreSQL.
- Local route: `http://127.0.0.1:8080/api/health`.
- Public Railway route: `https://american-latin-class-backend-production.up.railway.app/api/health`.
- Verification result: `database: connected`.
- Tested flow: enrollment, class plan, attendance, professional event, B2 dancer assignment, finance report, and dancer settlement calculation.

The backend was deployed from the local folder with Railway CLI, without uploading the project to a Git repository.
