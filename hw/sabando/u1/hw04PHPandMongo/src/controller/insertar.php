<?php
header('Content-Type: application/json');
require '../../vendor/autoload.php'; 

$uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0";

$response = [
    'status' => '',
    'message' => '',
    'details' => ''
];

try {
    $client = new MongoDB\Client($uri);
    
    $db = $client->students;
    $coleccion = $db->Customer;

    $name  = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $age   = isset($_POST['age']) ? (int)$_POST['age'] : 0;

    $documento = [
        'name'  => $name,
        'email' => $email,
        'age'   => $age,
        'created_at' => new MongoDB\BSON\UTCDateTime() 
    ];

    $resultado = $coleccion->insertOne($documento);

    $response['status'] = 'success';
    $response['message'] = '¡Registro exitoso!';
    $response['details'] = 'Se insertó el registro de ' . $name . " correctamente.\nID: " . $resultado->getInsertedId();

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Error en el registro';
    $response['details'] = 'Hubo un error al conectar o insertar: ' . $e->getMessage();
}

echo json_encode($response);
?>