# Usamos la imagen oficial de PHP con Apache (perfecto para proyectos monolíticos)
FROM php:8.2-apache

# Instalamos las dependencias del sistema necesarias para PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Habilitamos el mod_rewrite de Apache (muy usado si tienes URLs amigables o un .htaccess)
RUN a2enmod rewrite

# Copiamos todo el contenido de nuestra carpeta al directorio de Apache
COPY . /var/www/html/

# Damos los permisos adecuados
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponemos el puerto 80 (Render se encarga de rutear el tráfico a este puerto)
EXPOSE 80
