using ErazoStudentNames.Models;
using ErazoStudentNames.Services;
using Microsoft.AspNetCore.Mvc;

namespace ErazoStudentNames.Controllers;

public class StudentsController : Controller
{
    private readonly StudentService _studentService;

    public StudentsController(StudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View(new Student());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Student student)
    {
        if (!ModelState.IsValid)
        {
            return View(student);
        }

        await _studentService.CreateAsync(student);
        TempData["SuccessMessage"] = "Student saved successfully.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var students = await _studentService.GetAllAsync();
        return View(new StudentListViewModel { Students = students });
    }

    [HttpGet]
    public IActionResult Error()
    {
        return View();
    }
}
