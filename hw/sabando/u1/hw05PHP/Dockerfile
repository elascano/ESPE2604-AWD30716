FROM php:8.2-apache

# Instalamos las librerías necesarias para que PHP hable con MongoDB en Linux
RUN apt-get update && apt-get install -y \
    libssl-dev \
    unzip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Copiamos tus archivos (incluida la carpeta vendor) al servidor
COPY . /var/www/html/

# Exponemos el puerto 80
EXPOSE 80