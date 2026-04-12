<?php
include("../conexion.php");

$anio = isset($_GET['anio']) ? intval($_GET['anio']) : 0;
$mes = isset($_GET['mes']) ? intval($_GET['mes']) : 0;

if ($anio == 0 || $mes == 0){
    $anio = date("Y"); 
    $mes = date("m"); 
}

$sqlIngreso = "SELECT SUM(Monto) AS ingreso_total 
               FROM ingresos 
               WHERE YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
               AND Estado = 'Completado'";
$resultIngreso = $conn->query($sqlIngreso);
$ingresoTotal = $resultIngreso->fetch_assoc()['ingreso_total'] ?? 0;

$sqlGasto = "SELECT SUM(Monto) AS gasto_total 
             FROM egresos 
             WHERE YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
             AND Estado = 'Completado'";
$resultGasto = $conn->query($sqlGasto);
$gastoTotal = $resultGasto->fetch_assoc()['gasto_total'] ?? 0;


$sqlIngresoPorTipo = "SELECT c.Nombre AS categoria, SUM(i.Monto) AS total 
    FROM ingresos i 
    JOIN categorias c ON i.IdTipo = c.Id
    WHERE YEAR(i.Fecha) = $anio AND MONTH(i.Fecha) = $mes AND i.Estado = 'Completado'
    GROUP BY c.Nombre";
$resultIngresoPorTipo = $conn->query($sqlIngresoPorTipo);
$ingresosPorTipo = [];
while ($row = $resultIngresoPorTipo->fetch_assoc()) {
    $ingresosPorTipo[$row['categoria']] = $row['total'];
}

$sqlGastoPorTipo = "SELECT c.Nombre AS categoria, SUM(e.Monto) AS total 
    FROM egresos e 
    JOIN categorias c ON e.IdTipo = c.Id
    WHERE YEAR(e.Fecha) = $anio AND MONTH(e.Fecha) = $mes AND e.Estado = 'Completado'
    GROUP BY c.Nombre";
$resultGastoPorTipo = $conn->query($sqlGastoPorTipo);
$gastosPorTipo = [];
while ($row = $resultGastoPorTipo->fetch_assoc()) {
    $gastosPorTipo[$row['categoria']] = $row['total'];
}

$sqlIngresoPorFecha = "SELECT Fecha, SUM(Monto) AS MontoTotal
                       FROM ingresos
                       WHERE Estado = 'Completado' AND YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
                       GROUP BY Fecha
                       ORDER BY Fecha";
$resultIngresoPorFecha = $conn->query($sqlIngresoPorFecha);
$ingresosPorFecha = [];
while ($row = $resultIngresoPorFecha->fetch_assoc()) {
    $ingresosPorFecha[] = ['fecha' => $row['Fecha'], 'monto' => $row['MontoTotal']];
}

$sqlGastoPorFecha = "SELECT Fecha, SUM(Monto) AS MontoTotal
                     FROM egresos
                     WHERE Estado = 'Completado' AND YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
                     GROUP BY Fecha
                     ORDER BY Fecha";
$resultGastoPorFecha = $conn->query($sqlGastoPorFecha);
$gastosPorFecha = [];
while ($row = $resultGastoPorFecha->fetch_assoc()) {
    $gastosPorFecha[] = ['fecha' => $row['Fecha'], 'monto' => $row['MontoTotal']];
}

echo json_encode([
    "ingreso_total" => $ingresoTotal,
    "gasto_total" => $gastoTotal,
    "ingresos_por_tipo" => $ingresosPorTipo,
    "gastos_por_tipo" => $gastosPorTipo,
    "ingresos_por_fecha" => $ingresosPorFecha,
    "gastos_por_fecha" => $gastosPorFecha
]);

$conn->close();
?>
