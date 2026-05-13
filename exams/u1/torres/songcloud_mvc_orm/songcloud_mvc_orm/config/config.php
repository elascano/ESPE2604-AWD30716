<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => \App\Core\env('APP_NAME', 'SongCloud MVC ORM'),
        'env' => \App\Core\env('APP_ENV', 'local'),
        'url' => \App\Core\env('APP_URL', 'http://localhost:8000'),
    ],
    'db' => [
        'host' => \App\Core\env('DB_HOST', '127.0.0.1'),
        'port' => \App\Core\env('DB_PORT', '3306'),
        'database' => \App\Core\env('DB_DATABASE', 'songcloud_db'),
        'username' => \App\Core\env('DB_USERNAME', 'root'),
        'password' => \App\Core\env('DB_PASSWORD', ''),
        'charset' => \App\Core\env('DB_CHARSET', 'utf8mb4'),
    ],
];
