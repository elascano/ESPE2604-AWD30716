FROM php:8.2-cli

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev curl \
    && docker-php-ext-install pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY Controller/composer.json Controller/composer.lock ./Controller/
RUN cd Controller && composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY Controller ./Controller
COPY Model ./Model

RUN groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

EXPOSE 8080

USER app

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_TIMEZONE=America/Bogota

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t Controller/public"]
