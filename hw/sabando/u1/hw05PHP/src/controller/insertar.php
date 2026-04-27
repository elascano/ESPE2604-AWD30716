<?php
header('Content-Type: application/json');
require '../../vendor/autoload.php'; 

$uri = getenv('MONGODB_CONNECTION_STRING');

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
    $response['message'] = 'Successful Registration';
    $response['details'] = 'Registration of ' . $name . " inserted correctly.\nID: " . $resultado->getInsertedId();

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Registration Error';
    $response['details'] = 'There was an error connecting or inserting: ' . $e->getMessage();
}

echo json_encode($response);
?>