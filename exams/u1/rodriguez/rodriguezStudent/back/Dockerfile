# ── Stage 1: Build dependencies ───────────────────────────────────────────
FROM composer:2.7 AS builder

WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer update --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# ── Stage 2: Runtime ───────────────────────────────────────────────────────
FROM php:8.2-apache

# Install MongoDB PHP extension
RUN apt-get update && apt-get install -y libssl-dev pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set document root
ENV APACHE_DOCUMENT_ROOT /var/www/html

# Copy application source
WORKDIR /var/www/html
COPY --from=builder /app/vendor ./vendor
COPY . .

# Create a robust Apache virtual host configuration
RUN printf "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>\n" > /etc/apache2/sites-available/000-default.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
