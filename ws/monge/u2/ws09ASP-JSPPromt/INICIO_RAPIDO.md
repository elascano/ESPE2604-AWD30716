# 🚀 TAX PROBLEM - GUÍA DE INICIO RÁPIDO

## ¿Qué es esto?

Una **aplicación web ASP.NET 8 MVC** lista para producción que gestiona productos y calcula automáticamente:
- ✅ **Subtotal** = Cantidad × Precio Unitario
- ✅ **IVA 15%** = Subtotal × 0.15 (Ecuador)
- ✅ **TOTAL** = Subtotal + IVA

Con:
- 📱 UI responsive con Bootstrap 5
- 🗄️ Base de datos Supabase (PostgreSQL)
- 🐳 Docker para despliegue en la nube
- 🏗️ Arquitectura SOLID y profesional

---

## ⚡ INICIO EN 5 MINUTOS

### Requisito Único
👉 **Descargar e instalar Docker Desktop** desde https://www.docker.com/products/docker-desktop

### Paso 1: Configurar Supabase (2 min)

1. Ir a https://app.supabase.com → **"New Project"**
2. Copiar la **contraseña** que generó
3. En **Database → Connection Pooling**, copiar el string `postgresql://postgres:...`
4. Editar archivo `.env`:
   ```
   DATABASE_CONNECTION_STRING=postgresql://postgres:PASTE_HERE@db.xxx.supabase.co:5432/postgres?sslmode=require
   ```
5. Ejecutar **este SQL en Supabase** (SQL Editor):
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

### Paso 2: Ejecutar Docker (1 min)

**Windows (PowerShell o CMD):**
```bash
deploy.bat
```

**Mac/Linux (Bash):**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Manual:**
```bash
docker-compose up --build -d
docker-compose logs -f taxproblem-web
```

### Paso 3: Aceptar & Usar ✨

Abrir navegador: **http://localhost:5000**

---

## 📋 FUNCIONALIDADES

| Acción | Descripción |
|--------|-------------|
| **Ver Productos** | Tabla con todos: cantidad, precio, subtotal, IVA, total |
| **Nuevo Producto** | Formulario → Ingresar nombre, cantidad, precio |
| **Cálculo Automático** | IVA (15%) y Total se calculan en tiempo real |
| **Editar** | Cambiar datos → Recalcula automáticamente |
| **Eliminar** | Marca confirmación → Borra del sistema |
| **Totales** | Pie de tabla muestra sumatoria de IVA y TOTAL |

---

## 🏗️ ESTRUCTURA DE ARCHIVOS

```
taxProblem/
│
├── 📁 src/TaxProblem.Web/
│   ├── 📁 Models/
│   │   └── Product.cs              ← Modelo de base de datos
│   ├── 📁 Data/
│   │   └── ApplicationDbContext.cs  ← Conexión a Supabase
│   ├── 📁 Services/
│   │   ├── ITaxCalculatorService.cs  ← Interfaz: Calcula IVA
│   │   ├── TaxCalculatorService.cs   ← Implementación: 15% IVA
│   │   ├── IProductService.cs        ← Interfaz: CRUD
│   │   └── ProductService.cs         ← Implementación: CRUD
│   ├── 📁 Controllers/
│   │   └── ProductsController.cs    ← Lógica MVC
│   ├── 📁 Views/
│   │   ├── 📁 Products/
│   │   │   ├── Index.cshtml         ← Tabla con productos
│   │   │   ├── Create.cshtml        ← Formulario nuevo
│   │   │   ├── Edit.cshtml          ← Formulario editar
│   │   │   └── Delete.cshtml        ← Confirmación eliminar
│   │   └── 📁 Shared/
│   │       └── _Layout.cshtml       ← Diseño Bootstrap
│   ├── Program.cs                   ← Configuración principal
│   ├── appsettings.json             ← Configuración producción
│   └── TaxProblem.Web.csproj        ← Dependencias
│
├── Dockerfile                        ← Imagen para nube
├── docker-compose.yml               ← Orquestación Docker
├── .env.example                     ← Template variables
├── deploy.bat                       ← Script Windows
├── deploy.sh                        ← Script Mac/Linux
├── README.md                        ← Documentación completa
└── DESARROLLO.md                    ← Guía desarrollo
```

---

## 🔧 CONFIGURACIÓN POR AMBIENTE

### Producción (Supabase)
- Connection String: Supabase PostgreSQL
- IVA: 15%
- Logging: Information
- Env: Production

### Desarrollo Local
- Connection String: localhost postgresql
- IVA: 15%
- Logging: Debug
- Env: Development
- Archivo: `appsettings.Development.json`

---

## 💡 EJEMPLO DE USO

1. **Crear Producto:**
   - Nombre: "Laptop Dell"
   - Cantidad: 2
   - Precio: $1000
   - **Resultado automático**: Subtotal=$2000, IVA=$300, **Total=$2300**

2. **Ver en Tabla:**
   - Aparece en Index.cshtml
   - Muestra todos los cálculos
   - Pie de tabla suma totales

3. **Editar:**
   - Click "Editar" → Cantidad a 3
   - **Nuevo resultado**: Subtotal=$3000, IVA=$450, **Total=$3450**

---

## 🚨 TROUBLESHOOTING

| Problema | Solución |
|----------|----------|
| Error de conexión Supabase | Verificar Connection String en `.env` |
| Puerto 5000 ocupado | `docker-compose down` luego `docker-compose up` |
| BD vacía | Ejecutar CREATE TABLE SQL en Supabase |
| Docker no inicia | `docker logs taxproblem-web` para ver error |
| "Cannot connect to DB" | Esperar 30 seg, intentar refresh navegador |

---

## 📞 PRUEBAS RÁPIDAS

### ¿La aplicación está funcionando?
```bash
curl http://localhost:5000/Products/Index
```

### ¿Conecta a Supabase?
```bash
docker exec taxproblem-web curl -X GET http://localhost/Products/Index
```

### Ver logs en tiempo real
```bash
docker-compose logs -f taxproblem-web --tail 50
```

---

## 🌐 DESPLEGAR A LA NUBE

### Azure Container Instances (Recomendado)
```bash
az container create --resource-group mi-grupo \
  --name taxproblem \
  --image taxproblem:latest \
  --port 80 \
  --environment-variables \
    "ConnectionStrings__DefaultConnection=postgresql://..."
```

### AWS ECR / Google Cloud Run
Mismo proceso, solo cambiar endpoint del registro.

---

## ✅ CHECKLIST PRE-PRODUCCIÓN

- [ ] Archivo `.env` configurado con credenciales Supabase
- [ ] Tabla `products` creada en Supabase
- [ ] `docker compose up` inicia sin errores
- [ ] Página se carga en http://localhost:5000
- [ ] Crear producto → aparece en tabla
- [ ] Editar producto → recalcula IVA correctamente
- [ ] Eliminar producto → se borra de tabla
- [ ] IVA mostrado es 15% (verificar cálculos)
- [ ] Bootstrap responsive (abrir en móvil)
- [ ] Docker build exitoso sin advertencias

---

## 🎓 PATRÓN ARQUITECTÓNICO

**SOLID Implementation:**
```
Controlador (MVC)
    ↓
productService.CreateAsync() ← Single Responsibility
    ↓
taxCalculatorService.CalculateTax() ← Lógica de negocio
    ↓
DbContext.SaveChangesAsync() ← Persistencia
    ↓
Supabase PostgreSQL ← Datos
```

**Ventajas:**
- ✅ Fácil de testear (interfaces)
- ✅ Fácil de modificar (extensibilidad)
- ✅ Código organizado (responsabilidades claras)
- ✅ Reutilizable (servicios inyectable

s)

---

## 📊 TECNOLOGÍAS

| Stack | Versión | Propósito |
|-------|---------|----------|
| .NET | 8.0 LTS | Runtime ASP.NET |
| EF Core | 8.0 | ORM y migraciones |
| PostgreSQL | 15 | Base de datos (Supabase) |
| Razor | 8.0 | Vistas servidor |
| Bootstrap | 5.3 | UI responsive |
| Docker | - | Contenedor |

---

## 🎯 SIGUIENTES PASOS

1. **Autenticación**: Agregar login (Supabase Auth)
2. **Reportes**: Exportar a PDF/Excel
3. **API REST**: Endpoints `/api/products`
4. **Testing**: Unit tests con xUnit
5. **CI/CD**: GitHub Actions automático

---

## 📝 NOTAS IMPORTANTES

⚠️ **ANTES de ir a producción:**
- Cambiar passwords Supabase
- Configurar HTTPS
- Agregar autenticación
- Backups automáticos
- Monitoring & alertas

✅ **Ya incluido:**
- Validaciones
- Manejo de errores
- Logging
- Health checks Docker
- Multi-stage Docker (imagen pequeña)

---

**¡Tu aplicación está lista! 🎉**

Cualquier duda: revisa README.md o DESARROLLO.md

