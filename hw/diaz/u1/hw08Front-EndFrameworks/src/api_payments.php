<?php
require 'vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->payments;

    // GET → obtener pagos
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $records = $collection->find();

        $data = [];
        foreach ($records as $doc) {
            $data[] = $doc;
        }

        echo json_encode($data);
        exit;
    }

    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'models/Payment.php';
        
        $payment = new Payment($_POST);
        $data = $payment->toArray();
        
        $result = $collection->insertOne($data);

        echo json_encode([
            "success" => $result->getInsertedCount() > 0
        ]);
        exit;
    }

} catch (Exception $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
    exit;
}