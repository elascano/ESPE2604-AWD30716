<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . '/../vendor/autoload.php';

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$databaseUrl = $_ENV['DATABASE_URL'];
$urlParts = parse_url($databaseUrl);

$capsule = new Capsule;

$capsule->addConnection([
    "driver" => "pgsql",
    "host" => $urlParts['host'],
    "database" => ltrim($urlParts['path'], '/'),
    "username" => $urlParts['user'],
    "password" => $urlParts['pass'],
    "port" => $urlParts['port'],
    "charset" => "utf8",
    "schema" => "public",
    "sslmode" => "require"
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
