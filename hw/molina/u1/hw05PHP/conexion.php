<?php

$host = "aws-1-us-west-2.pooler.supabase.com";
$port = "5432";
$dbname = "postgres";
$user = "postgres.eiixnsxvyapufbkhaudp";
$password = "tUh9UGnWRasCTqXD";

try {
    $conexion = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $user,
        $password
    );

    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}