<?php

declare(strict_types=1);

header('Content-Type: application/json');

$connectionString = 'mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0';
$databaseCollection = 'students.Customer';

$customerName = trim($_POST['name'] ?? '');
$customerEmail = trim($_POST['email'] ?? '');
$customerAge = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);

if (mb_strlen($customerName) < 3) {
    echo json_encode([
        'status' => 'warning',
        'message' => 'Invalid name',
        'details' => 'Name must contain at least 3 characters.'
    ]);
    exit;
}

if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'warning',
        'message' => 'Invalid email',
        'details' => 'Email must have a valid format.'
    ]);
    exit;
}

if ($customerAge === false || $customerAge < 1 || $customerAge > 120) {
    echo json_encode([
        'status' => 'warning',
        'message' => 'Invalid age',
        'details' => 'Age must be an integer between 1 and 120.'
    ]);
    exit;
}

try {
    $atlasManager = new MongoDB\Driver\Manager($connectionString);
    $writeOperation = new MongoDB\Driver\BulkWrite();

    $insertedDocumentId = $writeOperation->insert([
        'name' => $customerName,
        'email' => $customerEmail,
        'age' => $customerAge,
        'registeredAt' => new MongoDB\BSON\UTCDateTime()
    ]);

    $atlasManager->executeBulkWrite($databaseCollection, $writeOperation);

    echo json_encode([
        'status' => 'success',
        'message' => 'Registry stored',
        'details' => 'Record created for ' . $customerName . ' with id ' . (string) $insertedDocumentId . '.'
    ]);
} catch (MongoDB\Driver\Exception\Exception $exception) {
    echo json_encode([
        'status' => 'error',
        'message' => 'MongoDB request failed',
        'details' => $exception->getMessage()
    ]);
}
