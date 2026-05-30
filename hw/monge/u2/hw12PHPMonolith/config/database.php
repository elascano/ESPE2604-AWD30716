<?php
/**
 * config/database.php
 * 
 * Database connection manager using the Singleton design pattern.
 * Responsible solely for initializing and providing the PDO connection.
 */

class Database {
    private static $connection = null;

    /**
     * Retrieves the database connection instance.
     * 
     * @return PDO
     * @throws Exception
     */
    public static function getConnection() {
        if (self::$connection === null) {
            // Load local .env variables if present
            self::loadEnv(__DIR__ . '/../.env');

            $host = getenv('DB_HOST') ?: 'localhost';
            $port = getenv('DB_PORT') ?: '5432';
            $dbname = getenv('DB_NAME') ?: 'postgres';
            $user = getenv('DB_USER') ?: 'postgres';
            $password = getenv('DB_PASSWORD') ?: '';
            $sslmode = getenv('DB_SSLMODE') ?: 'require';

            try {
                $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode";
                
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];

                self::$connection = new PDO($dsn, $user, $password, $options);
            } catch (PDOException $e) {
                // If local container env variables are set, we check those as well
                throw new Exception("Database Connection Error: " . $e->getMessage());
            }
        }
        return self::$connection;
    }

    /**
     * Parses a .env file and loads environment variables.
     * 
     * @param string $path Absolute path to the .env file
     */
    private static function loadEnv($path) {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            // Skip comments and empty lines
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }

            // Split into key and value
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Strip surrounding single or double quotes
                if (preg_match('/^"([^"]*)"$/', $value, $matches) || preg_match("/^'([^']*)'$/", $value, $matches)) {
                    $value = $matches[1];
                }

                // Only set if not already defined (allows OS environment to take precedence)
                if (getenv($key) === false) {
                    putenv("$key=$value");
                    $_ENV[$key] = $value;
                    $_SERVER[$key] = $value;
                }
            }
        }
    }
}
