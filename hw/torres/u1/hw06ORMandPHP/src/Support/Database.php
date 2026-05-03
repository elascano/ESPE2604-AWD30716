<?php
declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Capsule\Manager as Capsule;

final class Database
{
    public static function boot(): void
    {
        $capsule = new Capsule();

        $capsule->addConnection([
            'driver' => $_ENV['DB_CONNECTION'] ?? 'pgsql',
            'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
            'port' => $_ENV['DB_PORT'] ?? '5432',
            'database' => $_ENV['DB_DATABASE'] ?? 'postgres',
            'username' => $_ENV['DB_USERNAME'] ?? 'postgres',
            'password' => $_ENV['DB_PASSWORD'] ?? '',
            'charset' => 'utf8',
            'prefix' => '',
            'schema' => 'public',
            'sslmode' => $_ENV['DB_SSLMODE'] ?? 'require',
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
}

