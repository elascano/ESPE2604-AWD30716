<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database;
use App\ProductController;
use App\ProductService;

$db = Database::getInstance();
$productService = new ProductService($db);
$controller = new ProductController($productService);

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$route = '/' . trim(substr($requestUri, strlen($basePath)), '/');
$method = $_SERVER['REQUEST_METHOD'];

$productId = null;
if (preg_match('#^/product/(\w+)/?(edit|delete|details)?$#', $route, $matches)) {
    $productId = $matches[1] ?? null;
    if (isset($matches[2]) && $matches[2] !== '') {
        $route = '/product/' . $matches[2];
    }
} elseif (preg_match('#^/product/(\w+)$#', $route, $matches)) {
    $productId = $matches[1];
    $route = '/product/details';
}

try {
    match (true) {
        $route === '/' || $route === '/product' || $route === '/product/index'
            => $controller->index(),

        $route === '/product/create' && $method === 'GET'
            => $controller->createForm(),

        $route === '/product/create' && $method === 'POST'
            => $controller->create(),

        $route === '/product/details' && $productId !== null && $method === 'GET'
            => $controller->details($productId),

        $route === '/product/edit' && $productId !== null && $method === 'GET'
            => $controller->editForm($productId),

        $route === '/product/edit' && $productId !== null && $method === 'POST'
            => $controller->edit($productId),

        $route === '/product/delete' && $productId !== null && $method === 'GET'
            => $controller->deleteForm($productId),

        $route === '/product/delete' && $productId !== null && $method === 'POST'
            => $controller->delete($productId),

        default => $controller->notFound(),
    };
} catch (\Throwable $e) {
    $controller->error($e->getMessage());
}
