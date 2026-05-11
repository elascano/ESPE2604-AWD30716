<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query('SELECT * FROM professors ORDER BY id DESC');
        $professors = $stmt->fetchAll();
        echo json_encode($professors);
    } catch (\PDOException $e) {
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

    $sql = "INSERT INTO professors (fullName, age, email, phone, salary, department, hireDate, officeLocation) 
            VALUES (:fullName, :age, :email, :phone, :salary, :department, :hireDate, :officeLocation)";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'fullName' => $data['fullName'],
            'age' => $data['age'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'salary' => $data['salary'],
            'department' => $data['department'],
            'hireDate' => $data['hireDate'],
            'officeLocation' => $data['officeLocation'] ?? null
        ]);
        
        http_response_code(201);
        echo json_encode(['message' => 'Professor created successfully']);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
