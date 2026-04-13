<?php
include("../conexion.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['idIngreso']) ? $_POST['idIngreso'] : "";
    $tipoIngreso = isset($_POST['tipoIngresoA']) ? $_POST['tipoIngresoA'] : "";
    $metodoIngreso = isset($_POST['metodoIngresoA']) ? $_POST['metodoIngresoA'] : "";
    $montoIngreso = isset($_POST['montoIngresoA']) ? $_POST['montoIngresoA'] : "";
    $fechaIngreso = isset($_POST['fechaIngresoA']) ? $_POST['fechaIngresoA'] : "";
    $descripcionIngreso = isset($_POST['descripcionIngresoA']) ? $_POST['descripcionIngresoA'] : "";

    if (empty($id) || empty($tipoIngreso) || empty($montoIngreso) || empty($fechaIngreso) || empty($descripcionIngreso)) {
        echo json_encode(["error" => "Todos los campos son obligatorios."]);
        exit();
    }

    $sql = "UPDATE ingresos SET IdTipo = ?, Metodo = ?, Monto = ?, Fecha = ?, Descripcion = ? WHERE Id = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("sssssi", $tipoIngreso, $metodoIngreso, $montoIngreso, $fechaIngreso, $descripcionIngreso, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => "Ingreso actualizado correctamente."]);
        } else {
            echo json_encode(["error" => "Error al actualizar el ingreso."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la preparación de la consulta."]);
    }

    $conn->close();
} else {
    echo json_encode(["error" => "Método no permitido."]);
}
?>
