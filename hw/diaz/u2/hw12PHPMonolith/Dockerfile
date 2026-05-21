FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libssl-dev \
    pkg-config

RUN pecl install mongodb && docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY . .

RUN composer install --prefer-dist --no-interaction --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

RUN echo "<Directory /var/www/html/public>" >> /etc/apache2/apache2.conf && \
    echo "    Options -Indexes +FollowSymLinks" >> /etc/apache2/apache2.conf && \
    echo "    AllowOverride All" >> /etc/apache2/apache2.conf && \
    echo "    Require all granted" >> /etc/apache2/apache2.conf && \
    echo "</Directory>" >> /etc/apache2/apache2.conf

EXPOSE 80

CMD ["apache2-foreground"]
