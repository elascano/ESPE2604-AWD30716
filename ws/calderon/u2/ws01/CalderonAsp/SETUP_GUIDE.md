## GUÍA COMPLETA DE CONFIGURACIÓN

### Paso 1: Crear las carpetas necesarias

En Windows PowerShell, ejecuta:

```powershell
$basePath = "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"

# Crear directorios
@(
  "$basePath\Models",
  "$basePath\Controllers",
  "$basePath\Services",
  "$basePath\Views\Employee",
  "$basePath\Views\Home",
  "$basePath\Views\Shared",
  "$basePath\wwwroot\css",
  "$basePath\wwwroot\js"
) | ForEach-Object {
  if (!(Test-Path $_)) { New-Item -ItemType Directory -Path $_ -Force | Out-Null }
  Write-Host "✓ $_"
}
```

O en CMD:

```batch
cd "d:\UNIVERSIDAD\8vo Semestre (Quinto)\WebAv\U2\AspPractice"
mkdir Models
mkdir Controllers
mkdir Services
mkdir Views\Employee
mkdir Views\Home
mkdir Views\Shared
mkdir wwwroot\css
mkdir wwwroot\js
```

### Paso 2: Verificar archivos creados

Ya existen en el proyecto:
- ✅ EmployeeManagement.csproj
- ✅ Program.cs
- ✅ appsettings.json
- ✅ README.md

### Paso 3: Crear archivos manualmente o copiar el código

Ver los archivos en: ARCHIVOS_DEL_PROYECTO.txt

### Paso 4: Instalar paquetes NuGet

```bash
dotnet restore
```

### Paso 5: Configurar Supabase

En appsettings.json, reemplaza con tus credenciales.

### Paso 6: Crear tabla en Supabase

Ejecuta el SQL proporcionado en tu dashboard.

### Paso 7: Ejecutar aplicación

```bash
dotnet run
```

Listo! 🚀
