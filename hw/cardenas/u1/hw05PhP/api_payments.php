<?php
require 'vendor/autoload.php';

$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->payments;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = [
            'patientId' => $_POST['patientId'] ?? '',
            'paymentAmount' => (float) ($_POST['paymentAmount'] ?? 0),
            'paymentMethod' => $_POST['paymentMethod'] ?? '',
            'paymentDate' => $_POST['paymentDate'] ?? '',
            'creado_en' => new MongoDB\BSON\UTCDateTime()
        ];
        
        $result = $collection->insertOne($data);
        
        if ($result->getInsertedCount() > 0) {
            header('Location: views/success.php?type=payment');
        } else {
            header('Location: views/error.php?type=payment');
        }
        exit;
    }
} catch (Exception $e) {
    header('Location: views/error.php?type=payment');
    exit;
}
?>
