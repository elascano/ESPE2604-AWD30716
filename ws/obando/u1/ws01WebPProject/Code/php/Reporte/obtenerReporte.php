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
             AND Estado = 'Completado'";$resultGasto = $conn->query($sqlGasto);
$gastoTotal = $resultGasto->fetch_assoc()['gasto_total'] ?? 0;

$balanceNeto = $ingresoTotal - $gastoTotal;

$sqlCategoriaIngreso = "SELECT c.Nombre AS categoria, SUM(i.Monto) AS total 
                        FROM ingresos i 
                        JOIN categorias c ON i.IdTipo = c.Id
                        WHERE YEAR(i.Fecha) = $anio AND MONTH(i.Fecha) = $mes
                        AND i.Estado = 'Completado'
                        GROUP BY c.Nombre 
                        ORDER BY total DESC LIMIT 1";

$resultCategoriaIngreso = $conn->query($sqlCategoriaIngreso);
$categoriaIngreso = $resultCategoriaIngreso->fetch_assoc()['categoria'] ?? 'N/A';


$sqlCategoriaGasto = "SELECT c.Nombre AS categoria, SUM(e.Monto) AS total 
                     FROM egresos e 
                     JOIN categorias c ON e.IdTipo = c.Id
                     WHERE YEAR(e.Fecha) = $anio AND MONTH(e.Fecha) = $mes
                     AND e.Estado = 'Completado'
                     GROUP BY c.Nombre 
                     ORDER BY total DESC LIMIT 1";

$resultCategoriaGasto = $conn->query($sqlCategoriaGasto);
$categoriaGasto = $resultCategoriaGasto->fetch_assoc()['categoria'] ?? 'N/A';

$mesAnterior = ($mes == 1) ? 12 : $mes - 1;
$anioAnterior = ($mes == 1) ? $anio - 1 : $anio;

$sqlBalanceAnterior = "SELECT 
    (COALESCE((SELECT SUM(Monto) FROM ingresos WHERE YEAR(Fecha) = $anioAnterior AND MONTH(Fecha) = $mesAnterior AND Estado = 'Completado'), 0) 
    - 
    COALESCE((SELECT SUM(Monto) FROM egresos WHERE YEAR(Fecha) = $anioAnterior AND MONTH(Fecha) = $mesAnterior AND Estado = 'Completado'), 0)
    ) AS balance_anterior";


$resultBalanceAnterior = $conn->query($sqlBalanceAnterior);
$balanceAnterior = $resultBalanceAnterior->fetch_assoc()['balance_anterior'] ?? 0;

$variacion = ($balanceAnterior != 0) ? (($balanceNeto - $balanceAnterior) / abs($balanceAnterior)) * 100 : 0;

$sqlCantidadIngresos = "SELECT COUNT(*) AS cantidad 
                        FROM ingresos 
                        WHERE YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
                        AND Estado = 'Completado'";$resultCantidadIngresos = $conn->query($sqlCantidadIngresos);
$cantidadIngresos = $resultCantidadIngresos->fetch_assoc()['cantidad'] ?? 0;

$sqlCantidadGastos = "SELECT COUNT(*) AS cantidad 
                      FROM egresos 
                      WHERE YEAR(Fecha) = $anio AND MONTH(Fecha) = $mes
                      AND Estado = 'Completado'";$resultCantidadGastos = $conn->query($sqlCantidadGastos);
$cantidadGastos = $resultCantidadGastos->fetch_assoc()['cantidad'] ?? 0;

$sqlIngresoAnual = "SELECT SUM(Monto) AS ingreso_anual 
                    FROM ingresos 
                    WHERE YEAR(Fecha) = $anio
                    AND Estado = 'Completado'";
$resultIngresoAnual = $conn->query($sqlIngresoAnual);
$IngresoAnual = $resultIngresoAnual->fetch_assoc()['ingreso_anual'] ?? 0;

$sqlGastoAnual = "SELECT SUM(Monto) AS gasto_anual 
                  FROM egresos 
                  WHERE YEAR(Fecha) = $anio
                  AND Estado = 'Completado'";
$resultGastoAnual = $conn->query($sqlGastoAnual);
$GastoAnual = $resultGastoAnual->fetch_assoc()['gasto_anual'] ?? 0;

echo json_encode([
    "ingreso_total" => round($ingresoTotal, 2),
    "gasto_total" => round($gastoTotal, 2),
    "balance_neto" => round($balanceNeto, 2),
    "categoria_mayor_ingreso" => $categoriaIngreso,
    "categoria_mayor_gasto" => $categoriaGasto,
    "variacion_porcentaje" => round($variacion, 2),
    "cantidad_ingresos" => $cantidadIngresos,
    "cantidad_gastos" => $cantidadGastos,
    "ingreso_anual" => round($IngresoAnual, 2),
    "gasto_anual" => round($GastoAnual, 2),
]);

$conn->close();
?>
