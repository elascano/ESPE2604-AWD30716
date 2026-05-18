FROM php:8.2-cli

RUN apt-get update && apt-get install -y libpq-dev unzip && \
    docker-php-ext-install pdo_pgsql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN ln -s public/api api && ln -s public/css css && ln -s public/js js

ENV DB_CONNECTION=pgsql
ENV DB_HOST=aws-1-us-east-1.pooler.supabase.com
ENV DB_PORT=6543
ENV DB_DATABASE=postgres
ENV DB_USERNAME=postgres.lezbfnhzsnzcthrabnoc
ENV DB_PASSWORD=screamitoutloud
ENV DB_SCHEMA=public
ENV DATABASE_URL="postgresql://postgres.lezbfnhzsnzcthrabnoc:screamitoutloud@aws-1-us-east-1.pooler.supabase.com:6543/postgres"

EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080"]
