# Railway Deployment

This backend was deployed to Railway from the local folder, without using a Git repository.

## Public URL

```text
https://american-latin-class-backend-production.up.railway.app
```

## Health Check

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "project": "American Latin Class"
}
```

## Railway Project

```text
american-latin-class-backend
```

## Deployment Method

The deployment was created with Railway CLI:

```powershell
npx --yes @railway/cli init --name american-latin-class-backend
npx --yes @railway/cli add --service american-latin-class-backend
npx --yes @railway/cli variable set ...
npx --yes @railway/cli up --service american-latin-class-backend
npx --yes @railway/cli domain --service american-latin-class-backend
```

The service uses the `Dockerfile` in this folder.

## Environment Variables

The production variables were configured inside Railway. The database password is not stored in the repository.
