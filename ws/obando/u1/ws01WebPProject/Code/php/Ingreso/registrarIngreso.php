<?php
include("../conexion.php");
session_start(); 

$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo = $_POST["tipoIngreso"];
    $monto = $_POST["montoIngreso"];
    $fecha = $_POST["fechaIngreso"];
    $metodo = $_POST["metodoIngreso"];
    $descripcion = $_POST["descripcionIngreso"];
    $idUsuario = $_SESSION['id'];

    $stmt = $conn->prepare("INSERT INTO ingresos (Fecha, IdTipo, Monto, Metodo, IdUsuario, Descripcion, FechaRegistro) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssssss", $fecha, $tipo, $monto, $metodo, $idUsuario, $descripcion);

    if ($stmt->execute()) {
        $response["success"] = true;
    } else {
        $response["error"] = "No se pudo guardar el ingreso.";
    }

    $stmt->close();
    $conn->close();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
