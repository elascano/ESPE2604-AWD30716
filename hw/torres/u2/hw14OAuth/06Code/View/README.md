# View Layer

This folder contains the functional view layer for **American Latin Class**.

The frontend is built with HTML, CSS, vanilla JavaScript, Bootstrap 5, and Bootstrap Icons. It is organized as a modular website with separate pages for public visitors, pricing, enrollment, teacher check-in, login, and role dashboards.

## Included Pages

- `index.html`: public marketing home page for people interested in the dance academy.
- `pricing.html`: monthly style prices and promotional offer cards.
- `enrollment.html`: public enrollment request form for new students.
- `attendance-kiosk.html`: teacher attendance station for the school computer.
- `login.html`: two-step email/password login plus Google sign-in.
- `dashboard.html`: role-based dashboard after login.
- `session-ended.html`: protected-session exit page after logout or expired access.

## Internal Modules

- Student dashboard: progress, schedule, events, attendance percentage, and monthly calendar.
- Teacher dashboard: work summary, student attendance control, planning document URL, and work log.
- Director dashboard: students, teachers, teacher payroll, planning review, branch finances, and B2 professional events.

## JavaScript Organization

The project does not use React, Vue, Angular, or another frontend framework. The script is still plain JavaScript, but it is divided into classes:

- `ApiClient`: backend HTTP requests.
- `SessionStore`: session storage.
- `BranchStore`: branch data and select options.
- `PublicPagesController`: public forms and kiosk behavior.
- `DashboardController`: dashboard modules, data loading, and form handling.
- `Dom` and `Formatters`: view helpers.

## Real Access Flow

The portal no longer includes shortcut buttons or frontend demo users. Login is validated by the PHP backend, which checks users stored in Supabase with hashed passwords or verifies a Google ID token, then returns a signed token.

Academic test users:

```text
teacher@americanlatinclass.com / ALC2026*
student@americanlatinclass.com / ALC2026*
director@americanlatinclass.com / ALC2026*
```

The public academic users use English-only role names and emails. Spanish alias
accounts such as `alumno@americanlatinclass.com` should not be used in
production data.

Teacher station:

```text
attendance-kiosk.html
```

## Backend Integration

The frontend calls the deployed PHP backend:

```text
https://projectwebalcpractice-api.onrender.com
```

The backend URL is configured in `script/config.js` through `window.API_BASE_URL`. Google login uses `window.GOOGLE_CLIENT_ID`.

The frontend does not write directly to Supabase. Public enrollment, login, teacher check-in, class planning, attendance, student/teacher management, finance, and event operations go through the backend.

## Deploy to Render

Current production deploy:

```text
https://projectwebalcpractice-frontend.onrender.com
```

Render deploys from GitHub using:

```text
Build command: sh 06Code/View/render-build.sh
Publish directory: 06Code/View
```
