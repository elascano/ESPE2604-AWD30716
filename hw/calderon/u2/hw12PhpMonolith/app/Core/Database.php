<?php

declare(strict_types=1);

namespace App\Core;

use RedBeanPHP\R;

final class Database
{
    private static bool $connected = false;

    public static function loadEnv(string $path): void
    {
        if (!is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines ?: [] as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value, " \t\n\r\0\x0B\"'");
        }
    }

    public static function connect(): void
    {
        if (self::$connected) {
            return;
        }

        RedBean::load(APP_ROOT);

        $connection = self::connectionConfig();

        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s;sslmode=%s',
            $connection['host'],
            $connection['port'],
            $connection['database'],
            $connection['sslmode']
        );

        self::testConnection($dsn, $connection['user'], $connection['password']);

        R::setup($dsn, $connection['user'], $connection['password']);
        R::freeze(true);

        self::$connected = true;
    }

    /**
     * @return array{host: string, port: string, database: string, user: string, password: string, sslmode: string}
     */
    private static function connectionConfig(): array
    {
        $databaseUrl = self::optionalEnv('SUPABASE_DATABASE_URL') ?? self::optionalEnv('DATABASE_URL');

        if ($databaseUrl !== null) {
            return self::parseDatabaseUrl($databaseUrl);
        }

        return [
            'host' => self::env('SUPABASE_DB_HOST'),
            'port' => self::env('SUPABASE_DB_PORT', '5432'),
            'database' => self::env('SUPABASE_DB_NAME', 'postgres'),
            'user' => self::env('SUPABASE_DB_USER'),
            'password' => self::env('SUPABASE_DB_PASSWORD'),
            'sslmode' => self::env('SUPABASE_DB_SSLMODE', 'require'),
        ];
    }

    /**
     * @return array{host: string, port: string, database: string, user: string, password: string, sslmode: string}
     */
    private static function parseDatabaseUrl(string $databaseUrl): array
    {
        $parts = parse_url($databaseUrl);

        if ($parts === false || !isset($parts['host'], $parts['user'], $parts['pass'])) {
            throw new \RuntimeException('SUPABASE_DATABASE_URL is not a valid database URL.');
        }

        $query = [];
        parse_str($parts['query'] ?? '', $query);

        return [
            'host' => $parts['host'],
            'port' => (string) ($parts['port'] ?? 5432),
            'database' => ltrim($parts['path'] ?? '/postgres', '/') ?: 'postgres',
            'user' => rawurldecode($parts['user']),
            'password' => rawurldecode($parts['pass']),
            'sslmode' => (string) ($query['sslmode'] ?? 'require'),
        ];
    }

    private static function testConnection(string $dsn, string $user, string $password): void
    {
        try {
            $pdo = new \PDO($dsn, $user, $password, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]);
            $pdo = null;
        } catch (\PDOException $error) {
            throw new \RuntimeException('Could not connect to Supabase: ' . $error->getMessage(), 0, $error);
        }
    }

    private static function env(string $key, ?string $default = null): string
    {
        $value = self::optionalEnv($key) ?? $default;

        if ($value === null || $value === '') {
            throw new \RuntimeException("Missing {$key} in the .env file.");
        }

        return $value;
    }

    private static function optionalEnv(string $key): ?string
    {
        $value = $_ENV[$key] ?? getenv($key) ?: null;

        if ($value === null || $value === '') {
            return null;
        }

        return $value;
    }
}
