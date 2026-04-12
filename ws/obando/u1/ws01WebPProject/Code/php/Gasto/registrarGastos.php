<?php
include("../conexion.php");
session_start(); 
$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo = $_POST["tipoEgreso"];
    $monto = $_POST["montoGasto"];
    $fecha = $_POST["fechaGasto"];
    $metodo = $_POST["metodoGasto"];
    $descripcion = $_POST["descripcionGasto"];
    $idUsuario = $_SESSION['id'];

    $stmt = $conn->prepare("INSERT INTO egresos (Fecha, IdTipo,  Monto, Metodo, idUsuario, Descripcion) VALUES ( ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $fecha, $tipo , $monto, $metodo, $idUsuario, $descripcion);

    if ($stmt->execute()) {
        $response["success"] = true;
        // Puedes agregar más información a la respuesta si lo necesitas
    } else {
        
        $response["error"] = "No se pudo guardar el egreso.";
    }

    $stmt->close();
    $conn->close();
}

// Enviar respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
