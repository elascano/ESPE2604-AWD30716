<?php

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../app/Core/Database.php';
require_once __DIR__ . '/../app/Models/Product.php';
require_once __DIR__ . '/../app/Services/ProductService.php';
require_once __DIR__ . '/../app/Controllers/ProductController.php';

use App\Controllers\ProductController;
use App\Services\ProductService;

$service = new ProductService();
$controller = new ProductController($service);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && ($path === '/' || $path === '/products/create')) {
    $controller->create();
    exit;
}

if ($method === 'POST' && $path === '/products/store') {
    $controller->store();
    exit;
}

if ($method === 'GET' && $path === '/products') {
    $controller->index();
    exit;
}

if ($method === 'POST' && $path === '/products/update') {
    $controller->updateFromModal();
    exit;
}

if ($method === 'POST' && $path === '/products/delete') {
    $controller->deleteFromModal();
    exit;
}

http_response_code(404);
$pageTitle = 'Page Not Found';
$contentView = __DIR__ . '/../app/Views/products/not-found.php';
require __DIR__ . '/../app/Views/layouts/main.php';
