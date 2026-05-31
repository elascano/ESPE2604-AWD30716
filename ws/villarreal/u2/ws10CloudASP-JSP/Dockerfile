FROM php:8.2-cli

RUN apt-get update && apt-get install -y unzip libcurl4-openssl-dev && \
    pecl install mongodb-1.20.1 && \
    docker-php-ext-enable mongodb && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json .
RUN composer install --no-dev --no-interaction --optimize-autoloader

COPY . .

EXPOSE 8080

ENV MONGO_CONNECTION_STRING=mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal
ENV MONGO_DATABASE_NAME=ProductosMVC

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
