# ProductStorageMvc - ASP.NET Core MVC + Supabase PostgreSQL

This project uses ASP.NET Core MVC, Entity Framework Core ORM, Npgsql, Supabase PostgreSQL, and Vite for static assets.

It does not use a REST API. Forms are posted directly to MVC controller actions.

## Local execution

```bash
dotnet restore
npm install
npm run build
dotnet run
```

Open:

```text
http://localhost:5087
```

## Supabase table

Run `supabase-products-table.sql` in Supabase SQL Editor if the table does not exist.

## Render environment variable

Create this environment variable in Render:

```text
ConnectionStrings__DefaultConnection
```

Example value:

```text
Host=aws-1-us-west-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.YOUR_PROJECT_REF;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true;Timeout=60;Command Timeout=90;Keepalive=30;Pooling=true;Minimum Pool Size=0;Maximum Pool Size=10
```

## Docker

Render can deploy using the included Dockerfile.
