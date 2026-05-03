FROM php:8.2-cli

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY public ./public
COPY src ./src
COPY database ./database

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_TIMEZONE=America/Bogota

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t public"]
