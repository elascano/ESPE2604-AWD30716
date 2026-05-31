#!/bin/bash

# Script de despliegue rápido con Docker Compose
# Uso: ./deploy.sh

set -e

echo "🚀 Tax Problem - Despliegue Docker"
echo "=================================="

# Verificar si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📋 Copiando de .env.example..."
    cp .env.example .env
    echo "✏️  EDITA .env con tus credenciales Supabase antes de continuar"
    exit 1
fi

# Detener contenedores anteriores
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose down 2>/dev/null || true

# Construir imagen
echo "🔨 Construyendo imagen Docker..."
docker-compose build --no-cache

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker-compose up -d

# Esperar a que la BD esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# Mostrar logs
echo "📋 Mostrando logs de la aplicación..."
docker-compose logs -f taxproblem-web

# Información de acceso
echo ""
echo "✅ Despliegue completado"
echo "=================================="
echo "🌐 Acceder a: http://localhost:5000"
echo ""
echo "📋 Ver logs: docker-compose logs -f taxproblem-web"
echo "🛑 Detener: docker-compose down"
echo "=================================="
