using Microsoft.EntityFrameworkCore;
using ProductStorageMvc.Data;
using ProductStorageMvc.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("The database connection string was not found.");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("The database connection string is empty. Configure it in appsettings.json or user-secrets.");
    }

    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<ProductService>();

WebApplication app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// In local development with only HTTP, this line can produce an HTTPS warning.
// You may enable it again if your launchSettings.json includes an HTTPS profile.
// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Products}/{action=Create}/{id?}");

app.Run();
