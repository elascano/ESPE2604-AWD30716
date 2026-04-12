<?php
include("../conexion.php");

$sql = "SELECT DISTINCT YEAR(Fecha) AS 'anio' FROM ingresos ORDER BY anio DESC";
$result = $conn->query($sql);

$anios = [];
while ($row = $result->fetch_assoc()) {
    $anios[] = $row['anio'];
}

echo json_encode($anios);
$conn->close();
?>
