<?php
// config/db.php
require_once __DIR__ . '/../vendor/autoload.php';

function getMongoDBClient() {
    // Reemplace esto con su URI de Atlas que ya probó en Compass
    $uri = "mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/?appName=Cluster0";
    
    try {
        $client = new MongoDB\Client($uri);
        return $client;
    } catch (Exception $e) {
        die("Error de conexión a la base de datos: " . $e->getMessage());
    }
}
?>