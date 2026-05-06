<?php
require_once 'rb.php';

$host = getenv('DB_HOST') ?: 'db.kljlrchsawiteqearbgy.supabase.co';
$db   = getenv('DB_NAME') ?: 'postgres';
$user = getenv('DB_USER') ?: 'postgres';
$pass = getenv('DB_PASS') ?: 'WebAvWorksProject';
$port = getenv('DB_PORT') ?: '5432';

try {
    $testConnection = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    die(json_encode(['status' => 'error', 'message' => 'Detalle exacto del error: ' . $e->getMessage()]));
}

try {
    if (!R::testConnection()) {
        R::setup("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    die(json_encode(['status' => 'error', 'message' => 'Error de ORM: ' . $e->getMessage()]));
}
?>