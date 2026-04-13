<?php
include("../conexion.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['idGasto']) ? $_POST['idGasto'] : "";
    $tipoIngreso = isset($_POST['tipoGastoA']) ? $_POST['tipoGastoA'] : "";
    $metodoIngreso = isset($_POST['metodoGastoA']) ? $_POST['metodoGastoA'] : "";
    $montoIngreso = isset($_POST['montoGastoA']) ? $_POST['montoGastoA'] : "";
    $fechaIngreso = isset($_POST['fechaGastoA']) ? $_POST['fechaGastoA'] : "";
    $descripcionIngreso = isset($_POST['descripcionGastoA']) ? $_POST['descripcionGastoA'] : "";

    if (empty($id) || empty($tipoIngreso) || empty($montoIngreso) || empty($fechaIngreso) || empty($descripcionIngreso)) {
        echo json_encode(["error" => "Todos los campos son obligatorios."]);
        exit();
    }

    $sql = "UPDATE egresos SET IdTipo = ?, Metodo = ?, Monto = ?, Fecha = ?, Descripcion = ? WHERE Id = ?";

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
