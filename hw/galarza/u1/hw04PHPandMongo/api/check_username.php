<?php
require_once '../config/db.php';

header('Content-Type: application/json');

if (!isset($_GET['name'])) {
    echo json_encode(["exists" => false]);
    exit;
}

$client = getMongoDBClient();
$db = $client->students;
$collection = $db->Customer;

try {
    $name = filter_var($_GET['name'], FILTER_SANITIZE_STRING);
    $user = $collection->findOne(['penguin_name' => $name]);

    echo json_encode(["exists" => $user !== null]);
} catch (Exception $e) {
    echo json_encode(["exists" => false]);
}