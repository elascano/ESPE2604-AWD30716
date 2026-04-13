<?php
include("../conexion.php");

if (!isset($_POST['Id']) || empty($_POST['Id'])) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$Id = $_POST['Id'];

$consulta = "SELECT * FROM categorias where Id='$Id'" ;

$resultado = mysqli_query($conn, $consulta);

if ($resultado) {
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    echo json_encode($datos);
} else {
    echo json_encode(["error" => "Error en la consulta", "detalle" => mysqli_error($conn)]);
}

$conn->close();
?>
