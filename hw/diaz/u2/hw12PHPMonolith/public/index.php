<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../vendor/autoload.php';

session_start();

require_once __DIR__ . '/../config/Routes.php';
require_once __DIR__ . '/../app/controllers/ProductController.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$controller = new \App\Controllers\ProductController();

if ($method === 'POST' && isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === 'store') {
        $controller->store();
    } elseif ($action === 'delete') {
        $controller->delete();
    }
} else {
    $controller->index();
}
