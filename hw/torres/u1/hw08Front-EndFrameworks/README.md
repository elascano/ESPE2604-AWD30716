# HW08 - Front-End Frameworks

This assignment contains the functional frontend for **American Latin Class**.

The frontend is built with HTML, CSS, and JavaScript. It is organized as a modular website with separate pages for public visitors, enrollment, login, and role dashboards.

## Included Modules

- `index.html`: public home page with academy information.
- `enrollment.html`: public enrollment form for new students.
- `login.html`: one shared login for teachers, students, and directors.
- `dashboard.html`: role-based dashboards after login.
- Teacher dashboard: monthly class planning and attendance registration.
- Student dashboard: personal level, scholarship, and attendance summary.
- Director dashboard: students, attendance, branch finances, and B2 professional events.

## Run Locally

Open `index.html` in a browser.

The app works immediately with local demo data through `localStorage`.

Demo access:

```text
profesor@americanlatinclass.com / demo123
alumno@americanlatinclass.com / demo123
director@americanlatinclass.com / demo123
```

## Supabase Setup

Supabase is already connected for this academic deployment.

Project:

```text
american-latin-class
```

Project URL:

```text
https://luzlnnndzhpilgxacnim.supabase.co
```

The SQL in `database/supabase_schema.sql` was executed through Supabase CLI, and `script/supabase-client.js` was configured with the public anon key.

The app still keeps local demo data with `localStorage`, but enrollment, class planning, attendance, finance reports, and professional events can now send records to Supabase when the forms are submitted.

## Deploy to Netlify

The folder is ready for Netlify.

Current production deploy:

```text
https://creative-pothos-6c7a4c.netlify.app
```

Option A:

1. Go to Netlify.
2. Create a new site.
3. Drag and drop this folder.

Option B:

```powershell
npx netlify-cli deploy --prod --dir .
```

Netlify deployment requires a Netlify login or token. This project was deployed after authorizing the Netlify CLI.

## Backend Link

The PHP backend for the ORM assignment is available for review through:

```text
https://american-latin-class-backend-production.up.railway.app
```

Health check:

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

The backend was deployed from the local folder with Railway CLI, without uploading the project to a Git repository.
