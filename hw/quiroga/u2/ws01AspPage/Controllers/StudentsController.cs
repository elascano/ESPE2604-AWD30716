using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StudentPortal.Data;
using StudentPortal.Models;

namespace StudentPortal.Controllers
{
    public class StudentsController : Controller
    {
        private readonly MongoDbContext _context;

        public StudentsController(MongoDbContext context)
        {
            _context = context;
        }

        // PAGE 2: View with Table and Statistics
        public async Task<IActionResult> Index()
        {
            var students = await _context.Students.Find(_ => true).ToListAsync();
            
            var viewModel = new DashboardViewModel
            {
                Students = students
            };

            if (students.Any())
            {
                viewModel.CourseAverage = Math.Round(students.Average(s => s.Average), 2);
                viewModel.BestStudent = students.OrderByDescending(s => s.Average).First();
                viewModel.WorstStudent = students.OrderBy(s => s.Average).First();
            }

            return View(viewModel);
        }

        // PAGE 1: Form View (GET)
        public IActionResult Create()
        {
            return View();
        }

        // PAGE 1: Form Submission Handling (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Student student)
        {
            if (ModelState.IsValid)
            {
                // Compute the average grade before transferring data to MongoDB
                student.Average = Math.Round((student.Math + student.Science + student.History + student.English + student.Programming) / 5.0, 2);
                
                await _context.Students.InsertOneAsync(student);
                return RedirectToAction(nameof(Index));
            }
            return View(student);
        }
    }
}