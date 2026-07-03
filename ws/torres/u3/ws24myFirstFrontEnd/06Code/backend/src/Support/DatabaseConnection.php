<?php
declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Capsule\Manager as Capsule;

final class DatabaseConnection
{
    /** Boots Eloquent with environment-provided PostgreSQL/Supabase settings. */
    public function boot(): void
    {
        $capsule = new Capsule();

        $env = static fn(string $key, string $default = ''): string => (string) ($_ENV[$key] ?? getenv($key) ?: $default);

        $host = $env('DB_HOST', '127.0.0.1');
        $resolved = gethostbyname($host);
        if ($resolved !== $host && filter_var($resolved, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $host = $resolved;
        }

        $capsule->addConnection([
            'driver' => $env('DB_CONNECTION', 'pgsql'),
            'host' => $host,
            'port' => $env('DB_PORT', '5432'),
            'database' => $env('DB_DATABASE', 'postgres'),
            'username' => $env('DB_USERNAME', 'postgres'),
            'password' => $env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'schema' => 'public',
            'sslmode' => $env('DB_SSLMODE', 'require'),
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
}
