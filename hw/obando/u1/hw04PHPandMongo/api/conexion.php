<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require __DIR__ . '/../vendor/autoload.php';
$mongoUri = getenv('MONGODB_URI');

if (!$mongoUri) {
    http_response_code(500);
    echo json_encode(['error' => 'La variable de entorno MONGODB_URI no está configurada']);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    try {
        $client = new MongoDB\Client($mongoUri);
        $collection = $client->selectDatabase('students')->selectCollection('Customer');

        $new_customer = [
            'name' => $_POST['name'] ?? null,
            'email' => $_POST['email'] ?? null,
            'phone' => $_POST['phone'] ?? null,
            'date' => $_POST['date'] ?? null,
            'time' => $_POST['time'] ?? null,
            'hair_style' => $_POST['hair_style'] ?? null,
            'hair_type' => $_POST['hair_type'] ?? null,
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ];

        $result = $collection->insertOne($new_customer);
        if ($result->getInsertedCount() == 1) {
            echo json_encode(['message' => '¡Registro exitoso en MongoDB Atlas a través de PHP!']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al guardar el registro en la base de datos.']);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al conectar o insertar en MongoDB: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Acceso no autorizado.']);
}