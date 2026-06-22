<?php
ini_set('display_errors', 0);

try {
    require '../vendor/autoload.php';
    require_once '../models/Payment.php';

    $mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
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
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        header('Content-Type: application/json');
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
            echo json_encode(['success' => false, 'error' => 'No ID provided']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payment = new Payment($_POST);

        if (!$payment->validatePayment()) {
            header('Location: ../views/php/error.php?type=payment');
            exit;
        }

        if ($payment->paymentType === 'Final') {
            $payment->status = 'Completed';
        } else {
            $payment->status = 'Partial';
        }

        $result = $collection->insertOne($payment->toArray());

        if ($result->getInsertedCount() > 0) {
            header('Location: ../views/php/success.php?type=payment');
        } else {
            header('Location: ../views/php/error.php?type=payment');
        }
        exit;
    }
} catch (Throwable $e) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Location: ../views/php/error.php?type=payment');
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server Error']);
    }
    exit;
}