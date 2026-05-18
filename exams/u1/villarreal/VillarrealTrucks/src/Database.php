<?php

namespace App;

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    private static bool $initialized = false;

    public static function boot(): void
    {
        if (self::$initialized) {
            return;
        }

        $config = self::getDatabaseConfig();

        $capsule = new Capsule;
        $capsule->addConnection([
            'driver'   => $config['driver'],
            'host'     => $config['host'],
            'port'     => $config['port'],
            'database' => $config['database'],
            'username' => $config['username'],
            'password' => $config['password'],
            'charset'  => 'utf8',
            'prefix'   => '',
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        self::$initialized = true;
    }

    private static function getDatabaseConfig(): array
    {
        $databaseUrl = self::getEnv('DATABASE_URL');

        if ($databaseUrl !== '') {
            return self::parseDatabaseUrl($databaseUrl);
        }

        return [
            'driver'   => self::getEnv('DB_CONNECTION', 'pgsql'),
            'host'     => self::getEnv('DB_HOST', 'aws-1-us-east-1.pooler.supabase.com'),
            'port'     => self::getEnv('DB_PORT', '6543'),
            'database' => self::getEnv('DB_DATABASE', 'postgres'),
            'username' => self::getEnv('DB_USERNAME', 'postgres.lezbfnhzsnzcthrabnoc'),
            'password' => self::getEnv('DB_PASSWORD', 'screamitoutloud'),
        ];
    }

    private static function parseDatabaseUrl(string $url): array
    {
        $parts = parse_url($url);

        if ($parts === false || empty($parts['host']) || empty($parts['path']) || empty($parts['user'])) {
            throw new \RuntimeException('Invalid DATABASE_URL format. Use postgres://user:pass@host:port/database');
        }

        $driver = $parts['scheme'] ?? 'pgsql';

        if (in_array($driver, ['postgresql', 'postgres'], true)) {
            $driver = 'pgsql';
        }

        return [
            'driver'   => $driver,
            'host'     => $parts['host'],
            'port'     => $parts['port'] ?? '5432',
            'database' => ltrim($parts['path'], '/'),
            'username' => $parts['user'],
            'password' => $parts['pass'] ?? '',
        ];
    }

    private static function getEnv(string $key, string $default = ''): string
    {
        $value = $_ENV[$key] ?? getenv($key);
        return $value !== false ? (string) $value : $default;
    }
}
