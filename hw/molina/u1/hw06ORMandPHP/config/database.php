<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use RedBeanPHP\R;

try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $host = $_ENV['DB_HOST'] ?? '';
    $port = $_ENV['DB_PORT'] ?? '';
    $dbname = $_ENV['DB_NAME'] ?? '';
    $user = $_ENV['DB_USER'] ?? '';
    $password = $_ENV['DB_PASSWORD'] ?? '';

    if ($host === '' || $port === '' || $dbname === '' || $user === '' || $password === '') {
        die('Missing .env values. Check DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD.');
    }

    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";

    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    R::setup($dsn, $user, $password);

    R::freeze(true);
} catch (Throwable $e) {
    die('Connection error: ' . $e->getMessage());
}