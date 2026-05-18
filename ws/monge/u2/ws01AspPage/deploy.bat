@echo off
REM Script de despliegue rápido con Docker Compose (Windows)
REM Uso: deploy.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 Tax Problem - Despliegue Docker
echo ==================================

REM Verificar si .env existe
if not exist .env (
    echo ⚠️  Archivo .env no encontrado
    echo 📋 Copiando de .env.example...
    copy .env.example .env
    echo ✏️  EDITA .env con tus credenciales Supabase antes de continuar
    exit /b 1
)

REM Detener contenedores anteriores
echo 🛑 Deteniendo contenedores anteriores...
docker-compose down

REM Construir imagen
echo 🔨 Construyendo imagen Docker...
docker-compose build --no-cache

REM Iniciar servicios
echo ▶️  Iniciando servicios...
docker-compose up -d

REM Esperar a que la BD esté lista
echo ⏳ Esperando a que la base de datos esté lista...
timeout /t 10 /nobreak

REM Mostrar logs
echo 📋 Mostrando logs de la aplicación...
docker-compose logs -f taxproblem-web

REM Información de acceso
echo.
echo ✅ Despliegue completado
echo ==================================
echo 🌐 Acceder a: http://localhost:5000
echo.
echo 📋 Ver logs: docker-compose logs -f taxproblem-web
echo 🛑 Detener: docker-compose down
echo ==================================

endlocal
