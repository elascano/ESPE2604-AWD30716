<?php
require 'vendor/autoload.php';

$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';

try {
    $client = new MongoDB\Client($mongodbUri);
    $db = $client->FabulDentalDB;
    $collection = $db->supplies;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rawQuantity = trim((string) ($_POST['productInitialQuantity'] ?? ''));
        $validatedQuantity = filter_var(
            $rawQuantity,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if ($validatedQuantity === false) {
            header('Location: views/error.php?type=supply');
            exit;
        }

        $data = [
            'productName' => $_POST['productName'] ?? '',
            'productCode' => $_POST['productCode'] ?? '',
            'productInitialQuantity' => $validatedQuantity,
            'productUnitCost' => (float) ($_POST['productUnitCost'] ?? 0),
            'productPurchaseDate' => $_POST['productPurchaseDate'] ?? '',
            'productExpirationDate' => $_POST['productExpirationDate'] ?? '',
            'creado_en' => new MongoDB\BSON\UTCDateTime()
        ];

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