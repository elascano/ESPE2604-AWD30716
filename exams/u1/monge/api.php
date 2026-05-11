<?php
// Permitir peticiones desde cualquier origen (CORS) para evitar problemas si abres el HTML directo
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
use Models\Park;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'get_all') {
            $parks = Park::orderBy('park_name')->get();
            echo json_encode(['success' => true, 'parks' => $parks]);
            exit;
        }
    } elseif ($method === 'POST') {
        // Leer los datos JSON que envía JavaScript
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? '';

        if ($action === 'create_park') {
            $park = Park::create([
                'park_name' => $data['park_name'],
                'city' => $data['city'],
                'province' => $data['province'],
                'capacity' => $data['capacity'],
                'kids_allowed' => $data['kids_allowed'],
                'pets_allowed' => $data['pets_allowed'],
                'manager_name' => $data['manager_name'],
                'manager_id' => 7879
            ]);
            echo json_encode(['success' => true, 'park' => $park]);
            exit;
        } elseif ($action === 'delete_park') {
            Park::where('park_id', $data['id'])->delete();
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    echo json_encode(['success' => false, 'message' => 'Acción no válida o no especificada']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
