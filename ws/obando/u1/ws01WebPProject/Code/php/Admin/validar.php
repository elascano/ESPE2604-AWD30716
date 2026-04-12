<?php
include '../conexion.php';

// Verifica si los parámetros fueron enviados
if (isset($_POST['cedula']) || isset($_POST['email'])) {
    $cedula = $_POST['cedula'] ?? null; // Usar null si no existe
    $correo = $_POST['email'] ?? null;  // Usar null si no existe

    // Validar la cédula
    if ($cedula !== null) {
        $stmt_check_cedula = $conn->prepare("SELECT * FROM usuarios WHERE Cedula = ?");
        $stmt_check_cedula->bind_param("s", $cedula);
        $stmt_check_cedula->execute();
        $result_cedula = $stmt_check_cedula->get_result();
        if ($result_cedula->num_rows > 0) {
            echo "cedula"; // Si la cédula existe
            exit();
        }
    }

    // Validar el correo
    if ($correo !== null) {
        $stmt_check_correo = $conn->prepare("SELECT * FROM usuarios WHERE Correo = ?");
        $stmt_check_correo->bind_param("s", $correo);
        $stmt_check_correo->execute();
        $result_correo = $stmt_check_correo->get_result();
        if ($result_correo->num_rows > 0) {
            echo "correo"; // Si el correo existe
            exit();
        }
    }

    // Si no existe, devolver un valor vacío
    echo "ok";
} else {
    echo "error"; // Si no se recibe ni cédula ni correo
}

$conn->close();
?>
