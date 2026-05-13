<?php

namespace App;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $config = self::getDatabaseConfig();
            $dsn = sprintf(
                '%s:host=%s;port=%s;dbname=%s;sslmode=require',
                $config['driver'],
                $config['host'],
                $config['port'],
                $config['database']
            );

            try {
                self::$instance = new PDO($dsn, $config['username'], $config['password'], [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
                exit;
            }
        }

        return self::$instance;
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
            'username' => self::getEnv('DB_USERNAME', 'postgres'),
            'password' => self::getEnv('DB_PASSWORD', 'screamitoutloud'),
        ];
    }

    private static function parseDatabaseUrl(string $url): array
    {
        $parts = parse_url($url);

        if ($parts === false || empty($parts['host']) || empty($parts['path']) || empty($parts['user'])) {
            throw new \RuntimeException('Invalid DATABASE_URL format. Use postgres://user:pass@host:port/database');
        }

        $scheme = $parts['scheme'] ?? 'pgsql';
        if ($scheme === 'postgres' || $scheme === 'postgresql') {
            $scheme = 'pgsql';
        }

        return [
            'driver'   => $scheme,
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