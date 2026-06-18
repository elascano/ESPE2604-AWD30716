using GestionNominaMVC.Models;
using GestionNominaMVC.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Supabase;
using System.Threading.Tasks;

namespace GestionNominaMVC.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly Client _supabaseClient;

        public EmployeeController(Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        // GET: Employee
        public async Task<IActionResult> Index()
        {
            // Obtener empleados de Supabase
            var response = await _supabaseClient.From<Employee>().Get();
            var employees = response.Models;

            var viewModel = new PayrollViewModel
            {
                Employees = employees
            };

            return View(viewModel);
        }

        // GET: Employee/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Employee/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Employee employee)
        {
            if (ModelState.IsValid)
            {
                // Insertar en Supabase
                await _supabaseClient.From<Employee>().Insert(employee);
                return RedirectToAction(nameof(Index));
            }
            return View(employee);
        }

        // POST: Employee/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            await _supabaseClient.From<Employee>().Where(x => x.Id == id).Delete();
            return RedirectToAction(nameof(Index));
        }
    }
}
