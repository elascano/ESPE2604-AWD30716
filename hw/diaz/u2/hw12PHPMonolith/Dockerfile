FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    build-essential \
    autoconf \
    git \
    curl \
    zip \
    unzip \
    libssl-dev \
    libsasl2-dev \
    libsnappy-dev \
    pkg-config \
    zstd \
    libzstd-dev

RUN pecl install mongodb && docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY composer.json ./

RUN composer install --no-cache --prefer-dist --no-interaction --no-dev --optimize-autoloader

COPY . .

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

RUN echo "<Directory /var/www/html/public>" >> /etc/apache2/conf-available/custom.conf && \
    echo "    Options -Indexes +FollowSymLinks" >> /etc/apache2/conf-available/custom.conf && \
    echo "    AllowOverride All" >> /etc/apache2/conf-available/custom.conf && \
    echo "    Require all granted" >> /etc/apache2/conf-available/custom.conf && \
    echo "</Directory>" >> /etc/apache2/conf-available/custom.conf

RUN a2enconf custom

EXPOSE 80

CMD ["apache2-foreground"]


