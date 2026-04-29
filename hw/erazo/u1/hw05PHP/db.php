<?php
$host = 'aws-1-us-east-1.pooler.supabase.com';
$port = '5432';
$dbname = 'postgres';
$user = 'postgres.byixbngbbdyugffpnylx';
$password = 'Pufle.landia15';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión PDO: " . $e->getMessage());
}
?>