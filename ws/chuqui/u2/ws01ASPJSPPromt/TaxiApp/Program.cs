using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// AQUÍ VA TU ENLACE CON TU USUARIO Y TU CLAVE NUEVA
var mongoClient = new MongoClient("mongodb+srv://kachuqui_db_user:Simon123@cluster0.x7strgx.mongodb.net/?appName=Cluster0");
builder.Services.AddSingleton<IMongoClient>(mongoClient);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();