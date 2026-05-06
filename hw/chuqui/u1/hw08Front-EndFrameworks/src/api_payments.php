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

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            $result = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            echo json_encode(['success' => $result->getDeletedCount() > 0]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            unset($input['id']);
            unset($input['_id']);
            unset($input['isEditing']); // remove frontend flag
            $result = $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $input]
            );
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
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
