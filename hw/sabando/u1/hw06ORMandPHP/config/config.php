<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../models/User.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$db_url = $_ENV['DB_CONNECTION_STRING'];
$db_parts = parse_url($db_url);

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => $db_parts['host'],
    'database'  => trim($db_parts['path'], '/'),
    'username'  => $db_parts['user'],
    'password'  => $db_parts['pass'],
    'port'      => $db_parts['port'],
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

?>