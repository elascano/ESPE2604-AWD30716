<?php

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

use App\Controllers\ProductController;

$action     = $_GET['action'] ?? 'index';
$method     = $_SERVER['REQUEST_METHOD'];
$controller = new ProductController();

if ($action === 'create' && $method === 'GET') {
    $controller->create();
} elseif ($action === 'store' && $method === 'POST') {
    $controller->store();
} else {
    $controller->index();
}
