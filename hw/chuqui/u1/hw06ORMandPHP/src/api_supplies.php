<?php
require 'vendor/autoload.php';

$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->supplies;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'models/Supply.php';
        
        $supply = new Supply($_POST);

        if (!$supply->isValidQuantity()) {
            header('Location: views/error.php?type=supply');
            exit;
        }

        $data = $supply->toArray();

        $result = $collection->insertOne($data);

        if ($result->getInsertedCount() > 0) {
            header('Location: views/success.php?type=supply');
        } else {
            header('Location: views/error.php?type=supply');
        }
        exit;
    }
} catch (Exception $e) {
    header('Location: views/error.php?type=supply');
    exit;
}
?>