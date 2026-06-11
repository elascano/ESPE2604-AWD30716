::=====================================================
:: Script para crear la estructura completa del proyecto
:: Ejecutar como Administrador
::=====================================================

@echo off
cd /d "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"

echo Creating directories...
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

echo.
echo Creating C# files...

REM Employee.cs
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

REM ErrorViewModel.cs
(
echo namespace EmployeeManagement.Models;
echo.
echo public class ErrorViewModel
echo {
echo     public string? RequestId { get; set; }
echo     public bool ShowRequestId =^> !string.IsNullOrEmpty^(RequestId^);
echo }
) > Models\ErrorViewModel.cs

echo ✓ Models created

REM EmployeeController.cs
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
echo             {
echo                 return View^(employee^);
echo             }
echo.
echo             var result = await _supabaseService.CreateEmployeeAsync^(employee^);
echo             if ^(result != null^)
echo             {
echo                 TempData["Success"] = "Empleado creado exitosamente";
echo                 return RedirectToAction^("Index"^);
echo             }
echo             ModelState.AddModelError^(""^, "Error al crear el empleado"^);
echo             return View^(employee^);
echo         }
echo     }
echo }
) > Controllers\EmployeeController.cs

echo ✓ Controllers created

echo.
echo All directories and base files created!
echo Next steps:
echo 1. Create remaining .cshtml and .cs files
echo 2. Configure appsettings.json with Supabase credentials
echo 3. Run: dotnet restore
echo 4. Run: dotnet run
