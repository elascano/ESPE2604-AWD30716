#!/bin/sh
set -e

php -r '
$vars = [
    "APP_ENV" => getenv("APP_ENV") ?: "production",
    "APP_DEBUG" => getenv("APP_DEBUG") ?: "false",
    "APP_TIMEZONE" => getenv("APP_TIMEZONE") ?: "America/Bogota",
    "APP_KEY" => getenv("APP_KEY") ?: "CHANGE_ME_GENERATE_A_64_CHARACTER_RANDOM_VALUE",
    "FRONTEND_ORIGINS" => getenv("FRONTEND_ORIGINS") ?: "https://american-latin-class-frontend.netlify.app",
    "GOOGLE_CLIENT_ID" => getenv("GOOGLE_CLIENT_ID") ?: "",
    "DB_CONNECTION" => getenv("DB_CONNECTION") ?: "pgsql",
    "DB_HOST" => getenv("DB_HOST") ?: "127.0.0.1",
    "DB_PORT" => getenv("DB_PORT") ?: "5432",
    "DB_DATABASE" => getenv("DB_DATABASE") ?: "postgres",
    "DB_USERNAME" => getenv("DB_USERNAME") ?: "postgres",
    "DB_PASSWORD" => getenv("DB_PASSWORD") ?: "",
    "DB_SSLMODE" => getenv("DB_SSLMODE") ?: "require",
];

$lines = [];
foreach ($vars as $key => $value) {
    $lines[] = $key . "=" . $value;
}
file_put_contents("/app/backend/.env", implode("\n", $lines) . "\n");

echo "DB_HOST=" . (getenv("DB_HOST") ?: "NOT SET") . " DB_USER=" . (getenv("DB_USERNAME") ?: "NOT SET") . " DB_DATABASE=" . (getenv("DB_DATABASE") ?: "NOT SET") . " DB_PASSWORD_DETECTED=" . (getenv("DB_PASSWORD") ? "YES:len=" . strlen(getenv("DB_PASSWORD")) : "NO") . "\n";
'

php -S 0.0.0.0:${PORT:-10000} -t backend/public
