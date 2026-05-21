FROM composer:2.6 AS builder

WORKDIR /app

COPY composer.json ./

RUN composer install --prefer-dist --no-interaction --no-dev --optimize-autoloader

FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    autoconf \
    git \
    curl \
    wget \
    zip \
    unzip \
    ca-certificates \
    libssl-dev \
    libsasl2-dev \
    libsnappy-dev \
    libzstd-dev \
    pkg-config \
    zstd

RUN docker-php-ext-install -j$(nproc) opcache

RUN pecl install -o -f mongodb && \
    docker-php-ext-enable mongodb

RUN a2enmod rewrite headers

WORKDIR /var/www/html

COPY --from=builder /app/vendor ./vendor

COPY . .

RUN chown -R www-data:www-data /var/www/html

RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

RUN cat > /etc/apache2/conf-available/app.conf << 'EOF'
<Directory /var/www/html/public>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
EOF

RUN a2enconf app

EXPOSE 80

CMD ["apache2-foreground"]


