FROM php:8.2-apache

RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

COPY . /var/www/html/

ENV APACHE_DOCUMENT_ROOT /var/www/html/src

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

RUN a2enmod rewrite
