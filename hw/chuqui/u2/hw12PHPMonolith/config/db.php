<?php
require 'vendor/autoload.php';

$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

$mongoUri = getenv('MONGODB_URI');
if (!$mongoUri) {
    die("Error: MONGODB_URI environment variable is not set.");
}

try {
    $client = new MongoDB\Client($mongoUri);
    $database = $client->selectDatabase('TaxiDB');
    $ridesCollection = $database->selectCollection('Rides');
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>