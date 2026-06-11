using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TaxiApp.Models;

namespace TaxiApp.Controllers;

public class RidesController : Controller
{
    private readonly IMongoCollection<Ride> _rides;

    public RidesController(IMongoClient client)
    {
        var database = client.GetDatabase("TaxiDB");
        _rides = database.GetCollection<Ride>("History");
    }

    [HttpGet]
    public IActionResult Add()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Add(Ride newRide)
    {
        newRide.Date = DateTime.Now;
        _rides.InsertOne(newRide);
        return RedirectToAction("Summary");
    }

    [HttpGet]
    public IActionResult Summary()
    {
        var list = _rides.Find(r => true).ToList();
        ViewBag.Total = list.Sum(r => r.Price);
        return View(list);
    }
}