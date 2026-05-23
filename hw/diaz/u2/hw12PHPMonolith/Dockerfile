# --- Etapa 1: Builder ---
FROM composer:2 as builder

WORKDIR /app

# Copiamos solo los archivos de composer para aprovechar el cache de Docker
COPY composer.json composer.lock ./

# Instalamos las dependencias
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# --- Etapa 2: Final ---
FROM php:8.2-fpm

ENV DEBIAN_FRONTEND=noninteractive

# Instalar solo los paquetes necesarios para producción
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP
RUN pecl channel-update pecl.php.net && \
    pecl install -o -f mongodb && \
    docker-php-ext-enable mongodb

WORKDIR /var/www/html

# Copiar las dependencias desde la etapa "builder"
COPY --from=builder /app/vendor/ /var/www/html/vendor/

# Copiar el resto de la aplicación
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/public

# Copy configurations
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY php-fpm.conf /usr/local/etc/php-fpm.d/zz-php-fpm.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

