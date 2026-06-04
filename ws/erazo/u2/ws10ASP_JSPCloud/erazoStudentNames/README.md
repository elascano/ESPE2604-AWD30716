# Student Grades MVC

ASP.NET Core MVC app for registering students and three unit grades with MongoDB Atlas storage.

## Features

- MVC folder structure with `Controllers`, `Models`, `Services`, and `Views`.
- Server-side form post and table rendering, without API endpoints.
- Vue 3 is used inside the Razor form page for the live student mean and pass/fail preview.
- MongoDB Atlas connection through `MONGODB_URI`.
- Render deployment through Docker.

## Environment Variables

- `MONGODB_URI`: MongoDB Atlas connection string.
- `MONGODB_DATABASE`: Optional database name. Defaults to `student_grades`.

## Local Run

This machine needs the .NET 8 SDK installed to run locally:

```powershell
dotnet restore
dotnet run
```

Then open the URL printed by ASP.NET.
