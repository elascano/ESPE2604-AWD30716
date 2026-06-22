<?php
ini_set('display_errors', 0);

try {
    require '../vendor/autoload.php';
    require_once '../models/Supply.php';

    $mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->supplies;

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $cursor = $collection->find();
        $records = [];
        foreach ($cursor as $document) {
            $records[] = $document;
        }
        echo json_encode($records);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            $result = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
            echo json_encode(['success' => $result->getDeletedCount() > 0]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if ($id) {
            unset($input['id'], $input['_id'], $input['isEditing']);
            $result = $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($id)],
                ['$set' => $input]
            );
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $supply = new Supply($_POST);
        if (!$supply->isValidQuantity() || !$supply->areDatesValid()) {
            header('Location: ../views/php/error.php?type=supply');
            exit;
        }
        $result = $collection->insertOne($supply->toArray());
        if ($result->getInsertedCount() > 0) {
            header('Location: ../views/php/success.php?type=supply');
        } else {
            header('Location: ../views/php/error.php?type=supply');
        }
        exit;
    }
} catch (Throwable $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
    exit;
}