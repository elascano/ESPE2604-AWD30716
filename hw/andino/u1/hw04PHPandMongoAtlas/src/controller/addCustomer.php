<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use MongoDB\Client;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $names = trim(htmlspecialchars($_POST['names'] ?? ''));
    $surnames = trim(htmlspecialchars($_POST['surnames'] ?? ''));
    $birthDate = trim(htmlspecialchars($_POST['birth_date'] ?? ''));
    $age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
    $email = trim(htmlspecialchars($_POST['email'] ?? ''));
    $cellphone = trim(htmlspecialchars($_POST['cellphone'] ?? ''));

    if ($names === '' || $surnames === '' || $birthDate === '' || $age === false || $email === '' || $cellphone === '') {
        echo 'Please complete all fields correctly.';
        exit;
    }

    try {
        $client = new Client('mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0');

        $collection = $client->students->Customer;
        $insertOneResult = $collection->insertOne([
            'names' => $names,
            'surnames' => $surnames,
            'birth_date' => $birthDate,
            'age' => $age,
            'email' => $email,
            'cellphone' => $cellphone,
        ]);

        $insertedId = (string) $insertOneResult->getInsertedId();
        header('Location: /src/view/saved.php?id=' . urlencode($insertedId));
        exit;
    } catch (Throwable $e) {
        echo 'Error connecting to or saving in MongoDB: ' . $e->getMessage();
    }
}
?>