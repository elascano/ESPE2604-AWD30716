<?php
// Incluir la conexión a la base de datos
include("../conexion.php");



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario enviados a través de POST
    $cedula = $_POST['cedula'];
    $rol = $_POST['rol'];
    $estado = $_POST['estado'];

    // Verificar si los datos están vacíos
    if (empty($cedula) || empty($rol) || empty($estado)) {
        echo "Campos incompletos";
        exit;
    }

    // Actualizar los datos del usuario en la base de datos
    $sql = "UPDATE usuarios SET rol = ?, estado = ? WHERE cedula = ?";
    $stmt = $conn->prepare($sql);

    // Verificar si la consulta fue preparada correctamente
    if ($stmt) {
        // Vincular los parámetros
        $stmt->bind_param('sss', $rol, $estado, $cedula);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo "success";  // Si la actualización es exitosa
        } else {
            echo "Error en la actualización: " . $stmt->error;  // Si hubo un error en la ejecución
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $conn->error;  // Si hubo un error al preparar la consulta
    }

    // Cerrar la conexión
    $conn->close();
}
?>
