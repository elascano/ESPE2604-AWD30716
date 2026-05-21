FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

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
    ca-certificates

RUN docker-php-ext-install -j$(nproc) opcache

RUN pecl channel-update pecl.php.net && \
    pecl install -o -f mongodb && \
    docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN a2enmod rewrite headers

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-progress --prefer-dist --no-interaction --no-dev --no-scripts 2>&1 | tail -20

RUN composer dump-autoload --optimize --no-dev

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
