<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Controller\TruckController;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$controller = new TruckController();

try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if (isset($_GET['id'])) {
                $controller->show((int) $_GET['id']);
            } elseif (isset($_GET['search'])) {
                $controller->search($_GET['search']);
            } else {
                $controller->index();
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            $controller->store($input ?? []);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
