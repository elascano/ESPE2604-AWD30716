# Users PDF Frontend

Vue 3 frontend that consumes `GET /users`, displays the users in a polished table, and exports the visible records to a styled PDF report.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The default API URL is:

```env
VITE_API_BASE_URL=http://18.118.134.82:3000
```

Open the app at:

```text
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```
