# hw18-frontend-vue

Vue frontend for the Customer Table project.

## Environment

Copy `.env.example` to `.env`:

```env
VITE_BUSINESS_API_BASE_URL=/computerstore
```

## Run in development

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Build

```bash
npm run build
```

For production, copy `dist` to `/var/www/hw18-frontend-vue/dist` and use the Nginx file in `deployment/nginx-hw18-fe.conf`.
