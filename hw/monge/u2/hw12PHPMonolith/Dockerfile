FROM php:8.2-apache

# Install system dependencies and PHP extensions for PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory to Apache document root
WORKDIR /var/www/html

# Copy all project files into the container
COPY . /var/www/html/

# Adjust file permissions for web server
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 to the public
EXPOSE 80
