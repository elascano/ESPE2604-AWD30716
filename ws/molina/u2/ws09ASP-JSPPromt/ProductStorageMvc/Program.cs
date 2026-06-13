using Microsoft.EntityFrameworkCore;
using ProductStorageMvc.Data;
using ProductStorageMvc.Services;
using System.Globalization;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

CultureInfo defaultCulture = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("The database connection string was not found.");

    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<ProductService>();

WebApplication app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// In Render, HTTP is handled by the platform proxy. This line is intentionally disabled.
// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Products}/{action=Create}/{id?}");

app.Run();
