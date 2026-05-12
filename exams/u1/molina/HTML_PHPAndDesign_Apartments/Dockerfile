from php:8.3-cli

run apt-get update && apt-get install -y \
    unzip \
    git \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql

copy --from=composer:2 /usr/bin/composer /usr/bin/composer

workdir /var/www/html

copy . .

run composer install --no-dev --optimize-autoloader

expose 10000

cmd php -S 0.0.0.0:${PORT:-10000} -t /var/www/html