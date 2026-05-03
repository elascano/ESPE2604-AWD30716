<?php
require 'vendor/autoload.php';


$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->patients;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'models/Patient.php';
        
        $patient = new Patient($_POST);
        $data = $patient->toArray();

        $result = $collection->insertOne($data);

        if ($result->getInsertedCount() > 0) {
            header('Location: views/success.php?type=patient');
        } else {
            header('Location: views/error.php?type=patient');
        }
        exit;
    }
} catch (Exception $e) {
    header('Location: views/error.php?type=patient');
    exit;
}
?>