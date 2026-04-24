<?php

require __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Driver\ServerApi;

$usuario = 'oop';
$contrasena = 'oop';
$cluster = 'cluster0.9knxc.mongodb.net';
$appName = 'Cluster0';

$uri = "mongodb+srv://{$usuario}:{$contrasena}@{$cluster}/?appName={$appName}";

try {
    $client = new Client($uri, [], [
        'serverApi' => new ServerApi('1'),
    ]);

    $client->admin->command(['ping' => 1]);
} catch (\Throwable $e) {
    die('connection error to MongoDB: ' . $e->getMessage());
}