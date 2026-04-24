<?php

require __DIR__ . '/connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$nombre = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');

if ($nombre === '' || $email === '') {
    exit('All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('The email format is not valid.');
}

try {
    $coleccion = $client->selectCollection('students', 'Customer');

    $resultado = $coleccion->insertOne([
        'name' => $nombre,
        'email' => $email,
        'created_at' => date('c')
    ]);

    header("Location: index.html?success=1");
    exit;
} catch (\Throwable $e) {
    echo "Error saving record: " . $e->getMessage();
}