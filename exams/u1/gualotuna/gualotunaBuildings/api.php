<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use App\BuildingRepository;

$repo = new BuildingRepository();
$action = $_GET['action'] ?? '';

try {
    if ($action === 'insert' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode($repo->insert($data));

    } elseif ($action === 'find' && isset($_GET['id'])) {
        $doc = $repo->findById($_GET['id']);
        if ($doc) {
            echo json_encode($doc);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Building not found']);
        }

    } elseif ($action === 'all') {
        echo json_encode($repo->findAll());

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
