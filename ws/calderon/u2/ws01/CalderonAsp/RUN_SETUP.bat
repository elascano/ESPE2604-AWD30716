@echo off
title ASP.NET MVC Employee Management - Setup Wizard
color 0A

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║   🚀 ASP.NET MVC + Vue + Supabase - Setup Wizard 🚀       ║
echo ║                                                            ║
echo ║   Employee Management System                              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion
cd /d "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"

echo [PASO 1/3] Verificando directorios...
echo.

:: Crear directorios
set "dirs=Models Controllers Services Views Views\Employee Views\Home Views\Shared wwwroot wwwroot\css wwwroot\js"
for %%d in (%dirs%) do (
    if not exist "%%d" (
        mkdir "%%d"
        echo   ✓ Creado: %%d
    ) else (
        echo   ✓ Existe: %%d
    )
)

echo.
echo [PASO 2/3] Creando archivos C#...
echo.

if not exist "Models\Employee.cs" (
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
    echo   ✓ Models\Employee.cs creado
)

if not exist "Models\ErrorViewModel.cs" (
    (
    echo namespace EmployeeManagement.Models;
    echo.
    echo public class ErrorViewModel
    echo {
    echo     public string? RequestId { get; set; }
    echo     public bool ShowRequestId =^> !string.IsNullOrEmpty^(RequestId^);
    echo }
    ) > Models\ErrorViewModel.cs
    echo   ✓ Models\ErrorViewModel.cs creado
)

if not exist "Controllers\HomeController.cs" (
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
    echo     public HomeController^(ILogger^<HomeController^> logger^) { _logger = logger; }
    echo.
    echo     public IActionResult Index^(^) { return View^(^); }
    echo     public IActionResult Privacy^(^) { return View^(^); }
    echo.
    echo     [ResponseCache^(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true^)]
    echo     public IActionResult Error^(^)
    echo     {
    echo         return View^(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier }^);
    echo     }
    echo }
    ) > Controllers\HomeController.cs
    echo   ✓ Controllers\HomeController.cs creado
)

echo.
echo [PASO 3/3] Creando vistas y recursos...
echo.

if not exist "Views\_ViewStart.cshtml" (
    (
    echo @{
    echo     Layout = "_Layout";
    echo }
    ) > Views\_ViewStart.cshtml
    echo   ✓ Views\_ViewStart.cshtml creado
)

if not exist "Views\Home\Index.cshtml" (
    (
    echo @{
    echo     ViewData["Title"] = "Inicio";
    echo }
    echo.
    echo ^<div class="container mt-5 text-center"^>
    echo     ^<h1^>Bienvenido a Gestión de Empleados^</h1^>
    echo     ^<p class="lead mt-3"^>Aplicación ASP.NET MVC + Vue + Supabase^</p^>
    echo     ^<div class="mt-5"^>
    echo         ^<a asp-action="Index" asp-controller="Employee" class="btn btn-primary btn-lg"^>Ver Empleados^</a^>
    echo         ^<a asp-action="Create" asp-controller="Employee" class="btn btn-success btn-lg ms-2"^>Crear Empleado^</a^>
    echo     ^</div^>
    echo ^</div^>
    ) > Views\Home\Index.cshtml
    echo   ✓ Views\Home\Index.cshtml creado
)

if not exist "wwwroot\css\site.css" (
    (
    echo body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    echo main { min-height: calc^(100vh - 120px^); }
    echo .table { background-color: white; box-shadow: 0 1px 3px rgba^(0, 0, 0, 0.1^); }
    echo .btn-primary { background-color: #0d6efd; }
    echo .btn-primary:hover { background-color: #0b5ed7; }
    echo footer { background-color: #f5f5f5; border-top: 1px solid #ddd; }
    echo .table-responsive { box-shadow: 0 2px 4px rgba^(0, 0, 0, 0.1^); border-radius: 5px; }
    echo .form-control:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.2rem rgba^(13, 110, 253, 0.25^); }
    echo .alert { border-radius: 5px; }
    ) > wwwroot\css\site.css
    echo   ✓ wwwroot\css\site.css creado
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  ✅ ESTRUCTURA DEL PROYECTO CREADA EXITOSAMENTE           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📚 Lee los siguientes archivos en orden:
echo.
echo   1. PROYECTO_COMPLETADO.md  (Resumen general^)
echo   2. INICIO_RAPIDO.md        (Pasos rápidos^)
echo   3. ALL_FILES_CONTENT.md    (Código completo^)
echo.
echo ⚠️  IMPORTANTE:
echo   - Copia el contenido de SupabaseService_CODE.txt
echo   - Crea: Services\SupabaseService.cs
echo   - Configura: appsettings.json con Supabase
echo.
echo 🚀 Siguientes pasos:
echo   1. dotnet restore
echo   2. dotnet run
echo   3. Abre https://localhost:7000
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Presiona una tecla para continuar...                      ║
echo ╚════════════════════════════════════════════════════════════╝
pause > nul

cls
echo.
echo Archivo: INICIO_RAPIDO.md
echo.
type INICIO_RAPIDO.md | more
