FROM php:8.2-apache

# Update packages and install required dependencies for MongoDB and Composer
RUN apt-get update && apt-get install -y \
    libssl-dev \
    libcurl4-openssl-dev \
    pkg-config \
    unzip \
    git \
    && pecl install mongodb-1.19.3 \
    && docker-php-ext-enable mongodb

# Enable Apache mod_rewrite for friendly URLs
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the application source code to the container
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Install PHP dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Configure Apache to listen on the port provided by Render
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Give appropriate permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE ${PORT}
