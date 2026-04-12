<?php
include("../conexion.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id']; 

    $sql = "SELECT Cedula, Rol, Estado FROM usuarios WHERE Id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id); 

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $usuario = $result->fetch_assoc();
        echo json_encode([
            "Cedula" => $usuario['Cedula'],
            "Rol" => $usuario['Rol'],
            "Estado" => $usuario['Estado']
        ]);
    } else {
        echo json_encode(["error" => "Usuario no encontrado."]);
    }

    $stmt->close();
    $conn->close();
}
?>
