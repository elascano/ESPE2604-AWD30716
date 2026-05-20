# Product Storage MVC

ASP.NET Core MVC project for storing products with Entity Framework Core, Npgsql and Supabase PostgreSQL. It does not use REST APIs.

## Requirements

- .NET SDK
- Node.js and npm
- Supabase PostgreSQL project

## Setup

1. Restore .NET packages:

```bash
dotnet restore
```

2. Install frontend dependencies:

```bash
npm install
```

3. Configure your Supabase PostgreSQL connection in `appsettings.json` or with user-secrets:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=YOUR_HOST;Port=5432;Database=postgres;Username=YOUR_USERNAME;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true;Timeout=30;Command Timeout=60"
```

4. Build frontend assets:

```bash
npm run build
```

5. Create and apply migrations:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

If the `products` table already exists, either use the existing table if it has the correct columns or drop it together with `__EFMigrationsHistory` before applying migrations again.

6. Run the project:

```bash
dotnet run
```

Open:

```text
http://localhost:5087
```
