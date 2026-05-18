using StudentPortal.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. AGREGAR SERVICIOS AL CONTENEDOR
builder.Services.AddControllersWithViews();

// ¡AQUÍ ESTÁ LA CLAVE! Solo registramos el servicio, no ponemos toda la clase.
builder.Services.AddSingleton<MongoDbContext>();

var app = builder.Build();

// 2. CONFIGURAR EL PIPELINE DE PETICIONES HTTP
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

// Configurado para que tu página de Students sea la portada por defecto al entrar
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Students}/{action=Index}/{id?}");

app.Run();