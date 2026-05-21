# 1. Usamos la imagen oficial de PHP con el servidor web Apache integrado
FROM php:8.2-apache

# 2. Instalamos las dependencias de cURL (crucial para tu conexión a Supabase)
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    && docker-php-ext-install curl

# 3. Copiamos todos los archivos de tu proyecto local al directorio del servidor dentro del contenedor
COPY . /var/www/html/

# 4. Asignamos los permisos correctos para que Apache pueda leer tus vistas y el archivo CSS
RUN chown -R www-data:www-data /var/www/html

# 5. Indicamos que el contenedor escuchará en el puerto 80 (Render lo detectará automáticamente)
EXPOSE 80