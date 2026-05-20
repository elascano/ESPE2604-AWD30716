using Microsoft.AspNetCore.Mvc;
using GestionNominaMVC.Models;
using System.Linq;
using System.Threading.Tasks;

namespace GestionNominaMVC.Controllers
{
    public class EmployeesController : Controller
    {
        private readonly Supabase.Client _client;

        // Dependency Injection: ASP.NET Core automatically passes the Supabase client here
        public EmployeesController(Supabase.Client client)
        {
            _client = client;
        }

        // GET: Employees (Shows the table and total calculation)
        public async Task<IActionResult> Index()
        {
            // Fetch all employees from Supabase
            var response = await _client.From<Employee>().Get();
            var employees = response.Models;

            // Calculate total payroll cost for the company
            decimal totalPayrollCost = employees.Sum(e => e.NetSalary);
            
            // Send the total to the view using ViewBag
            ViewBag.TotalPayroll = totalPayrollCost;

            return View(employees);
        }

        // GET: Employees/Create (Shows the empty form)
        public IActionResult Create()
        {
            return View();
        }

        // POST: Employees/Create (Receives form data and saves to DB)
        [HttpPost]
        [ValidateAntiForgeryToken] // Security measure against CSRF attacks
        public async Task<IActionResult> Create(Employee employee)
        {
            if (ModelState.IsValid)
            {
                // Insert into Supabase
                await _client.From<Employee>().Insert(employee);
                
                // Redirect back to the table view
                return RedirectToAction(nameof(Index));
            }
            
            // If validation fails, return to the form showing errors
            return View(employee);
        }

        // POST: Employees/Delete/5
        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            await _client.From<Employee>().Where(x => x.Id == id).Delete();
            return RedirectToAction(nameof(Index));
        }
    }
}