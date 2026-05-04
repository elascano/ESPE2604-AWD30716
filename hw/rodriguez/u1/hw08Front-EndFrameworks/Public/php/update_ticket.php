<?php

ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$autoload = __DIR__ . '/../../vendor/autoload.php';
if (!file_exists($autoload)) {
    http_response_code(500);
    echo json_encode(['error' => 'Vendor not found.']);
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

$body = json_decode(file_get_contents('php://input'), true);
$id = $body['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Ticket ID is required']);
    exit;
}

try {
    $ticket = SupportTicket::find($id);
    if (!$ticket) {
        http_response_code(404);
        echo json_encode(['error' => 'Ticket not found']);
        exit;
    }

    $ticket->update([
        'full_name' => trim($body['full_name'] ?? $ticket->full_name),
        'ruc'       => trim($body['ruc'] ?? $ticket->ruc),
        'email'     => trim($body['email'] ?? $ticket->email),
        'category'  => $body['category'] ?? $ticket->category,
        'subject'   => trim($body['subject'] ?? $ticket->subject),
        'message'   => trim($body['message'] ?? $ticket->message),
        'priority'  => $body['priority'] ?? $ticket->priority,
    ]);

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
