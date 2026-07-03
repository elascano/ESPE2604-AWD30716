FROM php:8.2-cli

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev libcurl4-openssl-dev curl dos2unix \
    && docker-php-ext-install pdo_pgsql pgsql curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY backend/composer.json ./backend/
RUN cd backend && composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY backend ./backend
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN dos2unix /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh \
    && groupadd -r app && useradd -r -g app -d /app -s /sbin/nologin app \
    && chown -R app:app /app

USER app

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_TIMEZONE=America/Bogota

CMD ["/app/docker-entrypoint.sh"]