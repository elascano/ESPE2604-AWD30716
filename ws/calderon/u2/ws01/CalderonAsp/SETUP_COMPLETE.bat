@echo off
setlocal enabledelayedexpansion

color 0A
title Proyecto ASP.NET MVC - Generador de Estructura

cd /d "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"

echo.
echo =========================================
echo ASP.NET MVC Project Structure Generator
echo =========================================
echo.

REM Create all directories
echo [1/2] Creando directorios...
mkdir Models 2>nul
mkdir Controllers 2>nul
mkdir Services 2>nul
mkdir Views 2>nul
mkdir Views\Employee 2>nul
mkdir Views\Home 2>nul
mkdir Views\Shared 2>nul
mkdir wwwroot 2>nul
mkdir wwwroot\css 2>nul
mkdir wwwroot\js 2>nul

echo ✓ Directorios creados

echo.
echo [2/2] Creando archivos C# y vistas...

REM Models/Employee.cs
(
echo namespace EmployeeManagement.Models
echo {
echo     public class Employee
echo     {
echo         public string? Id { get; set; }
echo         public string? Name { get; set; }
echo         public string? Address { get; set; }
echo         public string? Cellphone { get; set; }
echo         public string? Email { get; set; }
echo         public decimal Salary { get; set; }
echo         public DateTime CreatedAt { get; set; }
echo         public DateTime UpdatedAt { get; set; }
echo     }
echo }
) > Models\Employee.cs

REM Models/ErrorViewModel.cs
(
echo namespace EmployeeManagement.Models;
echo.
echo public class ErrorViewModel
echo {
echo     public string? RequestId { get; set; }
echo     public bool ShowRequestId =^> !string.IsNullOrEmpty^(RequestId^);
echo }
) > Models\ErrorViewModel.cs

REM Controllers/HomeController.cs
(
echo using System.Diagnostics;
echo using EmployeeManagement.Models;
echo using Microsoft.AspNetCore.Mvc;
echo.
echo namespace EmployeeManagement.Controllers;
echo.
echo public class HomeController : Controller
echo {
echo     private readonly ILogger^<HomeController^> _logger;
echo.
echo     public HomeController^(ILogger^<HomeController^> logger^)
echo     {
echo         _logger = logger;
echo     }
echo.
echo     public IActionResult Index^(^)
echo     {
echo         return View^(^);
echo     }
echo.
echo     public IActionResult Privacy^(^)
echo     {
echo         return View^(^);
echo     }
echo.
echo     [ResponseCache^(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true^)]
echo     public IActionResult Error^(^)
echo     {
echo         return View^(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }^);
echo     }
echo }
) > Controllers\HomeController.cs

REM Controllers/EmployeeController.cs - SIMPLIFIED VERSION
(
echo using EmployeeManagement.Models;
echo using EmployeeManagement.Services;
echo using Microsoft.AspNetCore.Mvc;
echo.
echo namespace EmployeeManagement.Controllers
echo {
echo     public class EmployeeController : Controller
echo     {
echo         private readonly SupabaseService _supabaseService;
echo.
echo         public EmployeeController^(SupabaseService supabaseService^)
echo         {
echo             _supabaseService = supabaseService;
echo         }
echo.
echo         public async Task^<IActionResult^> Index^(^)
echo         {
echo             var employees = await _supabaseService.GetAllEmployeesAsync^(^);
echo             return View^(employees^);
echo         }
echo.
echo         public IActionResult Create^(^)
echo         {
echo             return View^(^);
echo         }
echo.
echo         [HttpPost]
echo         public async Task^<IActionResult^> Create^(Employee employee^)
echo         {
echo             if ^(!ModelState.IsValid^)
echo                 return View^(employee^);
echo.
echo             var result = await _supabaseService.CreateEmployeeAsync^(employee^);
echo             
echo             if ^(result != null^)
echo             {
echo                 TempData["Success"] = "Empleado creado exitosamente";
echo                 return RedirectToAction^("Index"^);
echo             }
echo             
echo             ModelState.AddModelError^(""^, "Error al crear"^);
echo             return View^(employee^);
echo         }
echo     }
echo }
) > Controllers\EmployeeController.cs

echo ✓ Controladores creados

REM Views/_ViewStart.cshtml
(
echo @{
echo     Layout = "_Layout";
echo }
) > Views\_ViewStart.cshtml

REM Views/Shared/_Layout.cshtml
(
echo ^<!DOCTYPE html^>
echo ^<html lang="es"^>
echo ^<head^>
echo     ^<meta charset="utf-8" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^>
echo     ^<title^>@ViewData["Title"] - Gestión de Empleados^</title^>
echo     ^<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /^>
echo     ^<link rel="stylesheet" href="~/css/site.css" asp-append-version="true" /^>
echo ^</head^>
echo ^<body^>
echo     ^<nav class="navbar navbar-expand-lg navbar-dark bg-dark"^>
echo         ^<div class="container"^>
echo             ^<a class="navbar-brand" href="/"^>Gestión de Empleados^</a^>
echo             ^<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"^>
echo                 ^<span class="navbar-toggler-icon"^>^</span^>
echo             ^</button^>
echo             ^<div class="collapse navbar-collapse" id="navbarNav"^>
echo                 ^<ul class="navbar-nav ms-auto"^>
echo                     ^<li class="nav-item"^>
echo                         ^<a class="nav-link" asp-action="Index" asp-controller="Employee"^>Empleados^</a^>
echo                     ^</li^>
echo                     ^<li class="nav-item"^>
echo                         ^<a class="nav-link" asp-action="Create" asp-controller="Employee"^>Crear Empleado^</a^>
echo                     ^</li^>
echo                 ^</ul^>
echo             ^</div^>
echo         ^</div^>
echo     ^</nav^>
echo.
echo     ^<main role="main"^>
echo         @RenderBody^(^)
echo     ^</main^>
echo.
echo     ^<footer class="bg-light text-center py-4 mt-5"^>
echo         ^<div class="container"^>
echo             ^<p class="text-muted"^>&copy; 2026 Gestión de Empleados - ASP.NET MVC + Vue + Supabase^</p^>
echo         ^</div^>
echo     ^</footer^>
echo.
echo     ^<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"^>^</script^>
echo     @await RenderSectionAsync^("Scripts", required: false^)
echo ^</body^>
echo ^</html^>
) > Views\Shared\_Layout.cshtml

echo ✓ Vistas compartidas creadas

REM Views/Home/Index.cshtml
(
echo @{
echo     ViewData["Title"] = "Inicio";
echo }
echo.
echo ^<div class="container mt-5 text-center"^>
echo     ^<h1^>Bienvenido a Gestión de Empleados^</h1^>
echo     ^<p class="lead mt-3"^>Aplicación ASP.NET MVC + Vue + Supabase^</p^>
echo     
echo     ^<div class="mt-5"^>
echo         ^<a asp-action="Index" asp-controller="Employee" class="btn btn-primary btn-lg"^>
echo             Ver Empleados
echo         ^</a^>
echo         ^<a asp-action="Create" asp-controller="Employee" class="btn btn-success btn-lg ms-2"^>
echo             Crear Empleado
echo         ^</a^>
echo     ^</div^>
echo ^</div^>
) > Views\Home\Index.cshtml

echo ✓ Vistas de Home creadas

REM Views/Employee/Create.cshtml
(
echo @model EmployeeManagement.Models.Employee
echo @{
echo     ViewData["Title"] = "Crear Empleado";
echo }
echo.
echo ^<div class="container mt-5"^>
echo     ^<h1^>Crear Nuevo Empleado^</h1^>
echo.
echo     ^<form asp-action="Create" asp-controller="Employee" method="post" class="mt-4"^>
echo         ^<div class="form-group mb-3"^>
echo             ^<label asp-for="Name" class="form-label"^>Nombre^</label^>
echo             ^<input asp-for="Name" class="form-control" placeholder="Nombre completo" required /^>
echo         ^</div^>
echo.
echo         ^<div class="form-group mb-3"^>
echo             ^<label asp-for="Email" class="form-label"^>Email^</label^>
echo             ^<input asp-for="Email" type="email" class="form-control" placeholder="correo@ejemplo.com" required /^>
echo         ^</div^>
echo.
echo         ^<div class="form-group mb-3"^>
echo             ^<label asp-for="Address" class="form-label"^>Dirección^</label^>
echo             ^<input asp-for="Address" class="form-control" placeholder="Dirección completa" required /^>
echo         ^</div^>
echo.
echo         ^<div class="form-group mb-3"^>
echo             ^<label asp-for="Cellphone" class="form-label"^>Teléfono^</label^>
echo             ^<input asp-for="Cellphone" class="form-control" placeholder="Número de teléfono" required /^>
echo         ^</div^>
echo.
echo         ^<div class="form-group mb-3"^>
echo             ^<label asp-for="Salary" class="form-label"^>Salario^</label^>
echo             ^<input asp-for="Salary" type="number" step="0.01" class="form-control" placeholder="0.00" required /^>
echo         ^</div^>
echo.
echo         ^<div class="form-group"^>
echo             ^<button type="submit" class="btn btn-success"^>Guardar Empleado^</button^>
echo             ^<a asp-action="Index" asp-controller="Employee" class="btn btn-secondary"^>Cancelar^</a^>
echo         ^</div^>
echo     ^</form^>
echo ^</div^>
) > Views\Employee\Create.cshtml

REM Views/Employee/Index.cshtml
(
echo @model List^<EmployeeManagement.Models.Employee^>
echo.
echo @{
echo     ViewData["Title"] = "Lista de Empleados";
echo }
echo.
echo ^<div class="container mt-5"^>
echo     ^<div class="d-flex justify-content-between align-items-center mb-4"^>
echo         ^<h1^>Empleados^</h1^>
echo         ^<a asp-action="Create" asp-controller="Employee" class="btn btn-primary"^>+ Crear Empleado^</a^>
echo     ^</div^>
echo.
echo     @if ^(TempData["Success"] != null^)
echo     {
echo         ^<div class="alert alert-success alert-dismissible fade show" role="alert"^>
echo             @TempData["Success"]
echo             ^<button type="button" class="btn-close" data-bs-dismiss="alert"^>^</button^>
echo         ^</div^>
echo     }
echo.
echo     ^<div id="app"^>
echo         ^<div class="table-responsive"^>
echo             ^<table class="table table-striped table-hover"^>
echo                 ^<thead class="table-dark"^>
echo                     ^<tr^>
echo                         ^<th^>Nombre^</th^>
echo                         ^<th^>Email^</th^>
echo                         ^<th^>Dirección^</th^>
echo                         ^<th^>Teléfono^</th^>
echo                         ^<th class="text-end"^>Salario^</th^>
echo                     ^</tr^>
echo                 ^</thead^>
echo                 ^<tbody^>
echo                     @if ^(Model != null ^&^& Model.Count ^> 0^)
echo                     {
echo                         @foreach ^(var employee in Model^)
echo                         {
echo                             ^<tr^>
echo                                 ^<td^>@employee.Name^</td^>
echo                                 ^<td^>@employee.Email^</td^>
echo                                 ^<td^>@employee.Address^</td^>
echo                                 ^<td^>@employee.Cellphone^</td^>
echo                                 ^<td class="text-end"^>$@employee.Salary.ToString^("N2"^)^</td^>
echo                             ^</tr^>
echo                         }
echo                     }
echo                 ^</tbody^>
echo                 ^<tfoot class="table-secondary fw-bold"^>
echo                     ^<tr^>
echo                         ^<td colspan="4" class="text-end"^>Total de Salarios:^</td^>
echo                         ^<td class="text-end"^>$^<span id="totalSalary"^>@^(Model?.Sum^(e =^> e.Salary^).ToString^("N2"^) ?? "0.00"^)^</span^>^</td^>
echo                     ^</tr^>
echo                 ^</tfoot^>
echo             ^</table^>
echo         ^</div^>
echo     ^</div^>
echo ^</div^>
echo.
echo @section Scripts {
echo     ^<script src="https://unpkg.com/vue@3/dist/vue.global.js"^>^</script^>
echo     ^<script src="~/js/employee-app.js"^>^</script^>
echo }
) > Views\Employee\Index.cshtml

echo ✓ Vistas de Empleados creadas

REM wwwroot/css/site.css
(
echo body {
echo     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
echo     background-color: #f5f5f5;
echo }
echo main { min-height: calc^(100vh - 120px^); }
echo .table { background-color: white; box-shadow: 0 1px 3px rgba^(0, 0, 0, 0.1^); }
echo .btn-primary { background-color: #0d6efd; }
echo .btn-primary:hover { background-color: #0b5ed7; }
echo footer { background-color: #f5f5f5; border-top: 1px solid #ddd; }
echo .table-responsive { box-shadow: 0 2px 4px rgba^(0, 0, 0, 0.1^); border-radius: 5px; }
echo .form-control:focus { border-color: #0d6efd; }
echo .alert { border-radius: 5px; }
) > wwwroot\css\site.css

echo ✓ Estilos CSS creados

REM wwwroot/js/employee-app.js
(
echo const { createApp } = Vue;
echo.
echo createApp^({
echo     data^(^) {
echo         return { employees: [], totalSalary: 0 }
echo     },
echo     mounted^(^) { this.calculateTotalSalary^(^); },
echo     methods: {
echo         calculateTotalSalary^(^) {
echo             const elements = document.querySelectorAll^('tbody tr td:nth-child^(5^)'^ );
echo             let total = 0;
echo             elements.forEach^(el =^> {
echo                 const salary = parseFloat^(el.textContent.replace^(/\$/g, ''^ ).replace^(/,/g, ''^ )^);
echo                 if ^(!isNaN^(salary^)^) total += salary;
echo             }^ );
echo             const totalEl = document.getElementById^('totalSalary'^ );
echo             if ^(totalEl^) totalEl.textContent = total.toFixed^(2^);
echo         }
echo     }
echo }^).mount^('#app'^ );
) > wwwroot\js\employee-app.js

echo ✓ Archivo Vue creado

echo.
echo =========================================
echo ✅ PROYECTO CREADO EXITOSAMENTE
echo =========================================
echo.
echo Próximos pasos:
echo 1. Crea la tabla en Supabase ^(ver ALL_FILES_CONTENT.md^)
echo 2. Configura appsettings.json con tus credenciales
echo 3. Ejecuta: dotnet restore
echo 4. Ejecuta: dotnet run
echo.
pause
