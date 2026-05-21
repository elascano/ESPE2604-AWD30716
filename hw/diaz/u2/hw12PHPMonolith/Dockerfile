FROM php:8.2-fpm

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
    ca-certificates \
    nginx \
    supervisor

RUN docker-php-ext-install -j$(nproc) opcache

RUN pecl channel-update pecl.php.net && \
    pecl install -o -f mongodb && \
    docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --no-progress --prefer-dist --no-interaction --no-dev

RUN composer dump-autoload --optimize --no-dev

COPY . .

RUN chown -R www-data:www-data /var/www/html

RUN mkdir -p /run/php

COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod -R 755 /var/www/html/public

EXPOSE 8080

CMD ["php-fpm"]
