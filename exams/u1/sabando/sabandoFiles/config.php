<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => '',
    'host'      => '',
    'database'  => '',
    'username'  => '',
    'password'  => '',
    'port'      => '',
    'charset'   => '',
    'prefix'    => '',
    'schema'    => '',
]);

$capsule->setAsGlobal();

$capsule->bootEloquent();

try {
    $capsule->getConnection()->getPdo();
} catch (\Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}

?>
