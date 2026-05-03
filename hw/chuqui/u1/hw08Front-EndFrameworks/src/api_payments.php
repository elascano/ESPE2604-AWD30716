<?php
require 'vendor/autoload.php';

$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->payments;

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json');
        $cursor = $collection->find();
        $records = [];
        foreach ($cursor as $document) {
            $records[] = $document;
        }
        echo json_encode($records);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'models/Payment.php';
        
        $payment = new Payment($_POST);
        $data = $payment->toArray();
        
        $result = $collection->insertOne($data);
        
        if ($result->getInsertedCount() > 0) {
            header('Location: views/success.php?type=payment');
        } else {
            header('Location: views/error.php?type=payment');
        }
        exit;
    }
} catch (Exception $e) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => $e->getMessage()]);
    } else {
        header('Location: views/error.php?type=payment');
    }
    exit;
}
?>
