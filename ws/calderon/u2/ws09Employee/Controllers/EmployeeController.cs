using Microsoft.AspNetCore.Mvc;
using EmployeeApp.Data;
using EmployeeApp.Models;

namespace EmployeeApp.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Employee employee)
        {
            _context.Employees.Add(employee);
            _context.SaveChanges();

            return RedirectToAction("List");
        }

        public IActionResult List()
        {
            var employees = _context.Employees.ToList();

            ViewBag.TotalSalary = employees.Sum(e => e.Salary);

            return View(employees);
        }
    }
}