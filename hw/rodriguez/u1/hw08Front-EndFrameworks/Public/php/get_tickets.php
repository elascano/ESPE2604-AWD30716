<?php

ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$autoload = __DIR__ . '/../../vendor/autoload.php';
if (!file_exists($autoload)) {
    http_response_code(500);
    echo json_encode(['error' => 'Vendor not found. Run composer install.']);
    exit;
}

try {
    require_once $autoload;
    require_once __DIR__ . '/bootstrap.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Bootstrap failed: ' . $e->getMessage()]);
    exit;
}

use App\Models\SupportTicket;

try {
    $tickets = SupportTicket::orderBy('created_at', 'desc')->get();
    echo json_encode(['success' => true, 'data' => $tickets]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
