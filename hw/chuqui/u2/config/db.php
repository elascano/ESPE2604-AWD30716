<?php
require 'vendor/autoload.php';

$mongoUri = getenv('MONGODB_URI') ?: "mongodb+srv://kachuqui_db_user:Simon123@cluster0.x7strgx.mongodb.net/?appName=Cluster0";

try {
    $client = new MongoDB\Client($mongoUri);
    $database = $client->selectDatabase('TaxiDB');
    $ridesCollection = $database->selectCollection('Rides');
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>