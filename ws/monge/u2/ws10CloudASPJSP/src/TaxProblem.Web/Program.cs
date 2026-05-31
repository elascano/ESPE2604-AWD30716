global using Microsoft.EntityFrameworkCore;
global using TaxProblem.Web.Data;
global using TaxProblem.Web.Models;
global using TaxProblem.Web.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllersWithViews();

// Registrar DbContext con Supabase PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// Registrar servicios con inyección de dependencias (SOLID - Single Responsibility)
builder.Services.AddScoped<ITaxCalculatorService, TaxCalculatorService>();
builder.Services.AddScoped<IProductService, ProductService>();

// Agregar logging
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

var app = builder.Build();

// Configurar pipeline HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Products}/{action=Index}/{id?}");

// Auto-migrate en startup (opcional, comentar si prefieres migrations manuales)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("✓ Base de datos migrada exitosamente");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Error al migrar BD: {ex.Message}");
    }
}

app.Run();
