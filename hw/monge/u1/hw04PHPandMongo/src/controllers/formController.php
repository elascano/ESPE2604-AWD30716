<?php
require '../../vendor/autoload.php';

use MongoDB\Client;

header("Content-Type: application/json");

try {
    $uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/";
    $client = new Client($uri);

    $db = $client->students;
    $collection = $db->Customer;

    if (!isset($_POST['name'], $_POST['email'], $_POST['age'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Data incomplete"
        ]);
        exit;
    }

    $data = [
        "name" => $_POST['name'],
        "email" => $_POST['email'],
        "age" => (int)$_POST['age'],
        "created_at" => date("Y-m-d H:i:s")
    ];

    $result = $collection->insertOne($data);

    echo json_encode([
        "status" => "success",
        "message" => "Data Upload",
        "id" => (string)$result->getInsertedId()
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}