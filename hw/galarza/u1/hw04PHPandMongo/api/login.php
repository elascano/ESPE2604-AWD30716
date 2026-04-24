<?php
session_start();
require_once '../config/db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$client = getMongoDBClient();
$db = $client->students;
$collection = $db->Customer;

try {
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $password = $_POST['password'];

    $user = $collection->findOne(['penguin_name' => $username]);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $username;
        $_SESSION['color'] = $user['color'];

        echo json_encode([
            "success" => true,
            "color" => $user['color']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid credentials"
        ]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error"]);
}
?>