<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $professors = Professor::orderBy('id', 'desc')->get();
        echo json_encode($professors);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided']);
        exit;
    }

    try {
        $professorData = [
            'fullname' => $data['fullName'],
            'age' => $data['age'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'salary' => $data['salary'],
            'department' => $data['department'],
            'hiredate' => $data['hireDate'], 
            'officelocation' => $data['officeLocation'] ?? null
        ];

        Professor::create($professorData);
        
        http_response_code(201);
        echo json_encode(['message' => 'Professor created successfully via ORM!']);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
