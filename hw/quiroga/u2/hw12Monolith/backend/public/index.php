<?php

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

use App\Controllers\ProductController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'GET') {
    $controller = new ProductController();
    $controller->index();
} elseif ($method === 'POST') {
    $controller = new ProductController();
    $controller->store();
} else {
    http_response_code(404);
    echo json_encode(["error" => "Endpoint not found"]);
}
