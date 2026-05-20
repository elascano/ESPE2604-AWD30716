using Microsoft.AspNetCore.Mvc;
using GestionNominaMVC.Models;
using System.Linq;
using System.Threading.Tasks;

namespace GestionNominaMVC.Controllers
{
    public class EmployeesController : Controller
    {
        private readonly Supabase.Client _client;

        public EmployeesController(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index()
        {
            var response = await _client.From<Employee>().Get();
            var teamMembers = response.Models;

            decimal monthlyPayrollExpense = teamMembers.Sum(e => e.NetSalary);
            
            ViewBag.TotalPayroll = monthlyPayrollExpense;

            return View(teamMembers);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Employee teamMember)
        {
            if (ModelState.IsValid)
            {
                await _client.From<Employee>().Insert(teamMember);
                
                return RedirectToAction(nameof(Index));
            }
            
            return View(teamMember);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(long id)
        {
            await _client.From<Employee>().Where(x => x.Id == id).Delete();
            return RedirectToAction(nameof(Index));
        }
    }
}