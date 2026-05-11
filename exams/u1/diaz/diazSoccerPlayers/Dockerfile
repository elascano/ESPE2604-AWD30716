FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    zip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

RUN a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html

CMD ["apache2-foreground"]