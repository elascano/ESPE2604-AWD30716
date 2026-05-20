using EmployeeManagement.Models;
using EmployeeManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly SupabaseService _supabaseService;

        public EmployeeController(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        public async Task<IActionResult> Index()
        {
            var employees = await _supabaseService.GetAllEmployeesAsync();
            return View(employees);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Employee employee)
        {
            if (!ModelState.IsValid)
                return View(employee);

            var result = await _supabaseService.CreateEmployeeAsync(employee);

            if (result != null)
            {
                TempData["Success"] = "Employee created successfully";
                return RedirectToAction("Index");
            }

            ModelState.AddModelError("", "Error creating employee");
            return View(employee);
        }
    }
}
