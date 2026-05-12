<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Config\Database;
use Controllers\StudentController;
use Repositories\StudentRepository;
use Services\StudentService;


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();


header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


Database::getInstance();

$repository = new StudentRepository();
$service    = new StudentService($repository);
$controller = new StudentController($service);


$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = rtrim($uri, '/');

$response = match (true) {
    
    $method === 'POST' && $path === '/api/students'
        => $controller->handleCreate(
            json_decode(file_get_contents('php://input'), true) ?? []
        ),

    
    $method === 'GET' && (bool) preg_match('#^/api/students/([a-f0-9]{24})$#', $path, $m)
        => $controller->handleFindById($m[1]),

    
    $method === 'GET' && $path === '/api/students'
        => $controller->handleFindAll(),

    
    $method === 'GET' && $path === '/health'
        => ['status' => 'ok', 'db' => 'mongodb'],

    
    default => (static function () {
        http_response_code(404);
        return ['success' => false, 'message' => 'Endpoint not found.'];
    })()
};

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
