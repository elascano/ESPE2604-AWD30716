<?php
$servername = "127.0.0.1";
$username = "root"; 
$password = "123123"; 
$database = "economiaf"; 
$port = 3307;

// Crear conexión (suprimir warning si falla)
$conn = @new mysqli($servername, $username, $password, $database, $port);

// Verificar conexión
if ($conn === false || $conn->connect_error) {
    // No detener el script aquí. Permite que la validación de login se realice en código si la DB no está disponible.
    $error = $conn === false ? mysqli_connect_error() : $conn->connect_error;
    error_log("Error de conexión: " . $error);
    $conn = false;
}
?>
