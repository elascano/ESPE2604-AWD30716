#!/bin/bash

ZIP_NAME="frontend.zip"
TARGET_DIR="/var/www/html"
TEMP_DIR="temp_frontend"

echo "=== 1. INSTALANDO NGINX Y UNZIP ==="
sudo apt-get update
sudo apt-get install -y nginx unzip

echo "=== 2. DESCOMPRIMIENDO Y COPIANDO ARCHIVOS ==="
if [ -f "$ZIP_NAME" ]; then
    # Limpiar el directorio actual de Nginx
    sudo rm -rf $TARGET_DIR/*
    
    # Crear carpeta temporal y descomprimir
    mkdir -p $TEMP_DIR
    unzip -o "$ZIP_NAME" -d $TEMP_DIR
    
    # Validar si el zip contenía la carpeta 'frontend' o los archivos directamente en la raíz
    if [ -d "$TEMP_DIR/frontend" ]; then
        sudo cp -r $TEMP_DIR/frontend/* $TARGET_DIR/
    else
        sudo cp -r $TEMP_DIR/* $TARGET_DIR/
    fi
    
    # Eliminar directorio temporal
    rm -rf $TEMP_DIR
else
    echo "ERROR: Archivo $ZIP_NAME no encontrado en este directorio."
    exit 1
fi

echo "=== 3. REINICIANDO EL SERVICIO NGINX ==="
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=== ¡DESPLIEGUE DEL FRONTEND COMPLETADO CON NGINX! ==="
