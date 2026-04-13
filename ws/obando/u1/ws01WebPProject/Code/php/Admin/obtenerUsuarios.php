<?php
session_start();
include('../conexion.php');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(["error" => "Acceso denegado"]);
    exit();
}

$mostrar_inactivos = isset($_GET['ver_inactivos']) && $_GET['ver_inactivos'] == '1';
$sql = "SELECT u.Id, u.Cedula, u.Nombre,u.Apellido, u.Correo, u.Estado, p.Nombre AS Rol FROM usuarios u LEFT JOIN perfiles p ON u.Rol = p.Id";

if (!$mostrar_inactivos) {
    $sql .= " WHERE Estado = 'Activo'";
}

$result = $conn->query($sql);
$usuarios = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);
$conn->close();
?>
