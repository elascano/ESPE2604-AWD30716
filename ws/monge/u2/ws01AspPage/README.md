# TAX PROBLEM - ASP.NET 8 MVC + Supabase + Docker

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker Desktop instalado (https://www.docker.com/products/docker-desktop)
- Cuenta Supabase (https://supabase.com)
- .NET 8 SDK (solo para desarrollo local sin Docker)

---

## 📋 Configuración Supabase

1. **Crear un proyecto en Supabase**
   - Ir a https://app.supabase.com
   - Click en "New Project"
   - Copiar la contraseña del usuario `postgres`

2. **Obtener Connection String**
   - En Supabase: Database → Connection Pooling
   - Copiar el enlace en formato XXXXX_postgresql://postgres:...

3. **Crear la tabla de productos** (ejecutar en Supabase SQL Editor):
   ```sql
   CREATE TABLE products (
       id BIGSERIAL PRIMARY KEY,
       name VARCHAR(150) NOT NULL,
       quantity INT NOT NULL,
       price NUMERIC(10,2) NOT NULL,
       subtotal NUMERIC(10,2) NOT NULL,
       iva NUMERIC(10,2) NOT NULL,
       total NUMERIC(10,2) NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
   );
   ```

---

## 🐳 Despliegue con Docker

### Opción 1: Docker Compose (Recomendado)

```bash
# Copiar plantilla de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales Supabase
# DATABASE_CONNECTION_STRING=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB?sslmode=require

# Construir y ejecutar
docker-compose up --build -d

# Ver logs
docker-compose logs -f taxproblem-web

# Detener
docker-compose down
```

**Acceder a la aplicación**: http://localhost:5000

### Opción 2: Docker Directo

```bash
# Construir imagen
docker build -t taxproblem:latest .

# Ejecutar contenedor
docker run -d \
  --name taxproblem-app \
  -p 5000:80 \
  -e "ConnectionStrings__DefaultConnection=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB?sslmode=require" \
  taxproblem:latest

# Ver logs
docker logs -f taxproblem-app

# Detener
docker stop taxproblem-app
docker rm taxproblem-app
```

---

## 💻 Desarrollo Local (Sin Docker)

### Requisitos
- .NET 8 SDK
- PostgreSQL 13+ (o Supabase)
- Visual Studio Code o Visual Studio

### Pasos

1. **Restaurar dependencias**
   ```bash
   cd src/TaxProblem.Web
   dotnet restore
   ```

2. **Configurar Connection String**
   - Editar `appsettings.Development.json`
   - Reemplazar `YOUR_*` con credenciales Supabase

3. **Ejecutar migraciones** (primera vez)
   ```bash
   dotnet ef database update
   ```

4. **Iniciar la aplicación**
   ```bash
   dotnet run
   ```

5. **Acceder**
   - http://localhost:5000

---

## 📁 Estructura del Proyecto

```
src/TaxProblem.Web/
├── Models/
│   └── Product.cs              # Modelo con propiedades calculadas
├── Data/
│   └── ApplicationDbContext.cs  # Entity Framework Core DbContext
├── Services/
│   ├── ITaxCalculatorService.cs # Interfaz: cálculo de IVA (15%)
│   ├── TaxCalculatorService.cs  # Implementación: IVA Ecuador
│   ├── IProductService.cs       # Interfaz: CRUD de productos
│   └── ProductService.cs        # Implementación: CRUD con lógica
├── Controllers/
│   └── ProductsController.cs    # MVC Controller (Create, Read, Update, Delete)
├── Views/
│   ├── Products/
│   │   ├── Index.cshtml         # Lista productos con tabla Bootstrap
│   │   ├── Create.cshtml        # Formulario nuevo (con cálculo en tiempo real)
│   │   ├── Edit.cshtml          # Formulario editar (con cálculo en tiempo real)
│   │   └── Delete.cshtml        # Confirmación eliminación
│   └── Shared/
│       ├── _Layout.cshtml       # Plantilla Bootstrap 5
│       └── _ViewStart.cshtml    # Layout por defecto
├── Program.cs                   # Configuración servicios, DbContext
├── appsettings.json            # Configuración producción
└── appsettings.Development.json # Configuración desarrollo

Dockerfile              # Multi-stage: Build + Runtime (optimizado)
docker-compose.yml      # Orquestación Docker
.dockerignore          # Excluir archivos en imagen
.env.example           # Plantilla variables de entorno
README.md              # Este archivo
```

---

## 🔧 Características Técnicas

| Aspecto | Implementación |
|--------|----------------|
| **Framework** | ASP.NET 8 MVC |
| **ORM** | Entity Framework Core 8 |
| **BD** | PostgreSQL (Supabase) |
| **Frontend** | Razor Views + Bootstrap 5 |
| **Impuestos** | ITaxCalculatorService (15% IVA) |
| **Patrón** | SOLID (Single Responsibility) |
| **Inyección** | Dependency Injection en Program.cs |
| **Docker** | Multi-stage (imagen ~200MB optimizada) |
| **Health Check** | Integrado en Dockerfile |

---

## 📊 Cálculo de Impuestos

**IVA: 15% (Ecuador)**

```
Subtotal = Precio Unitario × Cantidad
IVA      = Subtotal × 0.15
TOTAL    = Subtotal + IVA
```

**Ejemplo:**
- Cantidad: 2
- Precio: $100
- **Resultado**: Subtotal=$200, IVA=$30, **Total=$230**

---

## ✅ Flujo de Uso

1. **Acceder a http://localhost:5000**
2. **"Nuevo Producto"** → Ingresar Nombre, Cantidad, Precio
3. **Cálculo automático** → IVA (15%) y Total se calculan en tiempo real
4. **Guardar** → Se almacena en Supabase con valores calculados
5. **Ver tabla** → Index muestra todos los productos
6. **Editar** → Clickear "Editar", modificar valores, se recalcula IVA
7. **Eliminar** → Clickear "Eliminar", confirmar, se borra de BD

---

## 🚁 Despliegue en Producción

### Azure Container Instances (ACI)

```bash
# Loguear en Azure
az login

# Crear registro de contenedores
az acr create --resource-group mi-grupo --name taxproblem --sku Basic

# Push de imagen
docker tag taxproblem:latest taxproblem.azurecr.io/taxproblem:latest
docker push taxproblem.azurecr.io/taxproblem:latest

# Desplegar
az container create \
  --resource-group mi-grupo \
  --name taxproblem-app \
  --image taxproblem.azurecr.io/taxproblem:latest \
  --port 80 \
  --environment-variables \
    ConnectionStrings__DefaultConnection="postgresql://..." \
    ASPNETCORE_ENVIRONMENT="Production"
```

### AWS ECS / Google Cloud Run

Similar al proceso anterior, solo cambiar el registro de imágenes (ECR / GCR).

---

## 🛡️ Seguridad & Best Practices

✅ **Implementadas:**
- Conexión HTTPS a Supabase (SSL Mode=Require)
- Validación server-side en servicios
- Inyección de dependencias para testing
- DbContext dispose automático
- Health checks en Docker
- Logging estructurado

⚠️ **Recomendaciones Futuras:**
- Agregar autenticación (Supabase Auth / OAuth)
- CORS si se expone API REST
- Rate limiting
- Audit logging
- Unit tests con xUnit

---

## 📞 Soporte

- **Error de conexión a Supabase**: Verificar `appsettings.json` connection string
- **Tablas vacías**: Ejecutar script SQL de creación de tabla en Supabase
- **Docker no inicia**: Ejecutar `docker logs taxproblem-web` para ver errores
- **Puerto 5000 en uso**: Cambiar puerto en docker-compose.yml

---

## 📝 Notas

- La aplicación **auto-migra** la BD en startup (comentar si prefieres migrations manuales)
- Los cálculos de IVA se hacen en **backend** (seguridad)
- Bootstrap 5 se carga desde **CDN** (sin npm required)
- Base de datos incluida en compose solo para **desarrollo local**

**¡Listo para producción! 🎉**
