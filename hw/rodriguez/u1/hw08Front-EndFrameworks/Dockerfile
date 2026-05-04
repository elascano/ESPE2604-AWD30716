FROM php:8.2-apache

RUN apt-get update && apt-get install -y libpq-dev curl unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV APACHE_DOCUMENT_ROOT /var/www/html/Public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN a2enmod rewrite

COPY . /var/www/html/

WORKDIR /var/www/html

RUN composer install --no-dev --optimize-autoloader

CMD echo "Listen ${PORT:-80}" > /etc/apache2/ports.conf && \
    sed -i "s/<VirtualHost \*:.*/<VirtualHost \*:${PORT:-80}>/g" /etc/apache2/sites-available/000-default.conf && \
    apache2-foreground
