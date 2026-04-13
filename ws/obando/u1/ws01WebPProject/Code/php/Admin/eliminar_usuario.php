<?php
include("conexion.php");

if (isset($_GET["cedula"])) {
    $cedula = $_GET["cedula"];

    $stmt = $conn->prepare("DELETE FROM usuarios WHERE Cedula = ?");
    $stmt->bind_param("s", $cedula);

    if ($stmt->execute()) {
        echo "<script>alert('Usuario eliminado correctamente'); window.location.href='AdminUserLista.php';</script>";
    } else {
        echo "<script>alert('Error al eliminar usuario'); window.history.back();</script>";
    }

    $stmt->close();
}

$conn->close();
?>
