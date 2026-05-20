# ASP.NET 8 MVC - Guía Rápida de Desarrollo

## 🔍 Estructura Explicada

### Models/Product.cs
- **Propósito**: Entidad de base de datos (tabla `products`)
- **Características**:
  - `[Column("name")]` → Mapeo a columna PostgreSQL
  - `[Required]` → Validación server-side
  - `[DisplayFormat]` → Formato dinero (2 decimales)
  - Propiedades: Name, Quantity, Price, Subtotal, IVA, Total

### Data/ApplicationDbContext.cs
- **Propósito**: Contexto Entity Framework Core
- **Responsabilidad**: Comunicación con PostgreSQL (Supabase)
- **Métodos principales**:
  - `DbSet<Product>` → Tabla products
  - `OnModelCreating()` → Configuración Fluent API

### Services/
**IProductService.cs + ProductService.cs**
- CRUD completo: Create, Read, GetAll, Update, Delete
- Coordina: DbContext + TaxCalculatorService
- Validaciones de negocio

**ITaxCalculatorService.cs + TaxCalculatorService.cs**
- Cálcula: Subtotal, IVA(15%), Total
- Lógica centralizada (fácil de modificar porcentaje)
- Sin dependencias externas

### Controllers/ProductsController.cs
- **Acciones**:
  - `Index()` → GET lista productos
  - `Create()` → GET/POST nuevo
  - `Edit()` → GET/POST actualizar
  - `Delete()` → GET/POST eliminar
- Inyecta: IProductService, ITaxCalculatorService
- Manejo de errores: Try/catch con logging

### Views/Products/
- **Index.cshtml**: Tabla Bootstrap responsive, totales en pie de tabla
- **Create.cshtml**: Formulario + cálculo en tiempo real (JavaScript)
- **Edit.cshtml**: Igual a Create pero pre-llenado
- **Delete.cshtml**: Confirmación con detalles del producto

---

## 🏗️ Flujo de Datos

```
Usuario clicks "Nuevo"
    ↓
GET ProductsController.Create()
    ↓
Muestra vista Create.cshtml (formulario vacío)
    ↓
Usuario completa: Nombre, Cantidad, Precio
    ↓
JavaScript calcula en tiempo real:
    Subtotal = Cantidad × Precio
    IVA = Subtotal × 0.15
    Total = Subtotal + IVA
    ↓
Usuario clickea "Guardar"
    ↓
POST ProductsController.Create(Product)
    ↓
Validación ModelState
    ↓
ProductService.CreateProductAsync(product)
    ↓
TaxCalculatorService.CalculateTax()
    ProductService inserta en DB via DbContext
    ↓
SaveChangesAsync() → PostgreSQL
    ↓
Redirige a Index
    ↓
Mostra tabla con producto nuevo y totales
```

---

## 🔐 Seguridad Implementada

✅ **Server-side validation**: No confiar en JavaScript del cliente
✅ **Parametrized queries**: EF Core previene SQL injection
✅ **Anti-forgery tokens**: `[ValidateAntiForgeryToken]` en POST
✅ **Logging**: Errores registrados en Debug/Console
✅ **Error handling**: Try/catch con mensajes amigables

---

## 🚀 Modificaciones Comunes

### Cambiar porcentaje IVA
```csharp
// TaxCalculatorService.cs línea 13:
private const decimal IVA_RATE = 0.21m; // Cambiar a 21%
```

### Agregar nuevo campo a Product
```csharp
// 1. Models/Product.cs
public string SKU { get; set; } = string.Empty;

// 2. Data/ApplicationDbContext.cs (OnModelCreating)
entity.Property(e => e.SKU).HasColumnName("sku").HasColumnType("VARCHAR(50)");

// 3. Crear Migration
dotnet ef migrations add AddSKUToProduct
dotnet ef database update

// 4. ProductService.cs - actualizar CreateAsync, UpdateAsync
// 5. Views/Products/Create.cshtml, Edit.cshtml - agregar input
```

### Conectar a Supabase
```json
// appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "Server=db.PROJECT_ID.supabase.co;Port=5432;Database=postgres;User Id=postgres;Password=YOUR_PASSWORD;Ssl Mode=Require;Trust Server Certificate=true;"
}
```

---

## 🐳 Docker Troubleshooting

**Error: "Connection refused"**
- Verificar SMTP connection string en variables de entorno
- `docker logs taxproblem-web`

**Error: "Port 5000 already in use"**
```bash
docker-compose down
# O cambiar puerto en docker-compose.yml: "5001:80"
```

**Reconstruir imagen completa**
```bash
docker-compose build --no-cache
docker-compose up --build
```

---

## 📝 Archivo de Log

Logs se guardan automáticamente (si ILogger está configurado). Ver en Docker:
```bash
docker logs -f taxproblem-web --tail 50
```

---

## 🎯 Próximos Pasos (Fase 2)

- [ ] Agregar autenticación (Supabase Auth)
- [ ] Crear API REST (`/api/products`)
- [ ] Agregar reportes (total mensual)
- [ ] Sistema de múltiples usuarios
- [ ] Exportar a Excel
- [ ] Unit tests (xUnit + Moq)
- [ ] CI/CD (GitHub Actions)

---

**Aplicación lista para producción ✓**
