FROM php:8.2-fpm

ENV DEBIAN_FRONTEND=noninteractive

# 1. Instalar dependencias del sistema y herramientas de build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    autoconf \
    pkg-config \
    libssl-dev \
    libsasl2-dev \
    libsnappy-dev \
    libzstd-dev \
    zstd \
    git \
    curl \
    wget \
    zip \
    unzip \
    ca-certificates \
    nginx \
    supervisor

# ... (código anterior) ...

# Instalar extensiones de PHP
RUN pecl channel-update pecl.php.net && \
    pecl install -o -f mongodb-1.18.1 && \
    docker-php-ext-enable mongodb

# ... (resto del código) ...

# 3. Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ENV COMPOSER_MEMORY_LIMIT=-1

# ... (instalación de PHP y Nginx) ...

WORKDIR /var/www/html

# Copiar el resto de la aplicación
COPY . .

# Crear directorio para el socket de PHP-FPM y establecer permisos
RUN mkdir -p /run/php && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/public

# ... (resto del código) ...

# Copy configurations
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY php-fpm.conf /usr/local/etc/php-fpm.d/zz-php-fpm.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
