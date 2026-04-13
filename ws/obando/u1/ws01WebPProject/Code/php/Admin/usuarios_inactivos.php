<?php
session_start();
include('../conexion.php');

if (!isset($_SESSION['usuario'])) {
    header('Location: ../../html/Administrador/acceso_denegado.html');
    exit();
}

if (isset($_POST['cedula']) && isset($_POST['estado'])) {
    $cedula = $_POST['cedula'];
    $nuevo_estado = $_POST['estado'];

    $sql = "UPDATE usuarios SET Estado = ? WHERE Cedula = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ss", $nuevo_estado, $cedula);
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "error";
        }
        $stmt->close();
    } else {
        echo "error";
    }

    $conn->close();
    exit();
}
?>
