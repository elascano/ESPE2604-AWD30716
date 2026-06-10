FROM php:8.0-apache

RUN apt-get update && apt-get install -y \
    unzip \
    curl \
    libpq-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && a2enmod rewrite alias \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy backend dependencies and install
COPY backend/composer.json backend/composer.lock ./backend/
RUN cd backend && curl -sS https://getcomposer.org/installer | php && php composer.phar install --no-dev --optimize-autoloader

# Copy backend source
COPY backend/ ./backend/

# Copy frontend source
COPY frontend/ ./frontend/

# Update Apache DocumentRoot to point to frontend
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/frontend|g' \
    /etc/apache2/sites-available/000-default.conf

# Configure Apache to serve frontend and alias /api to backend/public
RUN echo 'Alias /api /var/www/html/backend/public\n\
<Directory /var/www/html/backend/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n\
<Directory /var/www/html/frontend>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/app.conf \
    && a2enconf app

EXPOSE 80
