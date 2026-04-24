<?php
// 1. OBLIGAR A PHP A MOSTRAR ERRORES (Solo usar en desarrollo)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 2. Resto de su código normal
require_once '../config/db.php';

header('Content-Type: application/json');

$client = getMongoDBClient();

$db = $client->students; 
$collection = $db->Customer;

try {
    $conteo = $collection->countDocuments();
    
    echo json_encode([
        "status" => "success",
        "mensaje" => "Conexión perfecta, Señor.",
        "documentos_en_customer" => $conteo
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "mensaje" => $e->getMessage()
    ]);
}
?>