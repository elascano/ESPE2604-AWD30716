<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;
use RuntimeException;

class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $host = getenv('SUPABASE_DB_HOST') ?: getenv('DB_HOST');
        $port = getenv('SUPABASE_DB_PORT') ?: getenv('DB_PORT') ?: '5432';
        $database = getenv('SUPABASE_DB_NAME') ?: getenv('DB_NAME') ?: 'postgres';
        $username = getenv('SUPABASE_DB_USER') ?: getenv('DB_USER');
        $password = getenv('SUPABASE_DB_PASSWORD') ?: getenv('DB_PASSWORD');

        if ((!$host || !$username || !$password) && getenv('DATABASE_URL')) {
            $databaseUrl = getenv('DATABASE_URL');
            $parts = parse_url($databaseUrl);

            if ($parts !== false) {
                $host = $parts['host'] ?? $host;
                $port = isset($parts['port']) ? (string) $parts['port'] : $port;
                $username = isset($parts['user']) ? urldecode($parts['user']) : $username;
                $password = isset($parts['pass']) ? urldecode($parts['pass']) : $password;
                $database = isset($parts['path']) ? ltrim($parts['path'], '/') : $database;
            }
        }

        if (!$host || !$username || !$password) {
            throw new RuntimeException('Database configuration is incomplete. Please configure Supabase environment variables.');
        }

        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s;sslmode=require',
            $host,
            $port,
            $database
        );

        try {
            self::$connection = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 30,
            ]);

            return self::$connection;
        } catch (PDOException $exception) {
            throw new RuntimeException('Database connection failed: ' . $exception->getMessage());
        }
    }
}
