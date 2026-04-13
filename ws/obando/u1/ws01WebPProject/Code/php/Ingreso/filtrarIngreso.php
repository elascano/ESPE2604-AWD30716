<?php
include("../conexion.php");

$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : "";
$fechaInicio = isset($_POST['fechaInicio']) ? $_POST['fechaInicio'] : "";
$fechaFin = isset($_POST['fechaFin']) ? $_POST['fechaFin'] : "";
$estado = isset($_POST['estado']) ? $_POST['estado'] : "";

$sql = 'SELECT i.Id, i.Fecha, c.Nombre AS "tipo", i.Monto, i.Metodo, i.Estado, 
               u.Nombre, u.Apellido, c.CodigoQR, i.FechaRegistro, i.Descripcion 
        FROM ingresos i 
        INNER JOIN usuarios u ON i.idUsuario = u.Id 
        INNER JOIN categorias c ON i.IdTipo = c.Id  
        WHERE c.tipo = "ingreso"';

if (!empty($tipo)) {
    $sql .= " AND c.Id = '$tipo'";
}

if (!empty($fechaInicio) && !empty($fechaFin)) {
    $sql .= " AND i.Fecha BETWEEN '$fechaInicio' AND '$fechaFin'";
}

if (!empty($estado) && $estado != "3") {
    if ($estado == "1") {
        $sql .= " AND i.Estado = 'Completado'";
    } elseif ($estado == "2") {
        $sql .= " AND i.Estado = 'Anulado'";
    }
}

$resultado = mysqli_query($conn, $sql);

if ($resultado) {
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    echo json_encode($datos);
} else {
    echo json_encode(["error" => "Error en la consulta"]);
}

$conn->close();
?>
