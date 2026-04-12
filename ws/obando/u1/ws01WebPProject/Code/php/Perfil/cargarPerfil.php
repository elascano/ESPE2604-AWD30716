<?php
session_start(); 

if (isset($_SESSION['id'])) {
    $userId = $_SESSION['id'];

    include("../conexion.php");

    $stmt = $conn->prepare("SELECT Id, Cedula, Nombre, Apellido, Correo FROM usuarios WHERE Id = ?");
    $stmt->bind_param("i", $userId); 

    if ($stmt->execute()) {
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            $response["success"] = true;
            $response["data"] = $userData;
        } else {
            $response["error"] = "No se encontró el usuario.";
        }
    } else {
        $response["error"] = "Error en la consulta: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    $response["error"] = "No se encontró el ID de usuario en la sesión.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>
