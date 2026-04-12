<?php
include("../conexion.php");

$consulta = 'SELECT 
    SUM(Monto) AS "IngresoTotal",
    SUM(CASE 
        WHEN YEAR(Fecha) = YEAR(CURRENT_DATE) AND MONTH(Fecha) = MONTH(CURRENT_DATE)
        THEN Monto
        ELSE 0
    END) AS "IngresoEsteMes"
FROM ingresos
WHERE Estado = "Completado";';

$consulta_egresos = 'SELECT 
    SUM(Monto) AS "EgresoTotal",
    SUM(CASE 
        WHEN YEAR(Fecha) = YEAR(CURRENT_DATE) AND MONTH(Fecha) = MONTH(CURRENT_DATE)
        THEN Monto
        ELSE 0
    END) AS "EgresoEsteMes"
FROM egresos
WHERE Estado = "Completado";';


$resultadoIngresos = mysqli_query($conn, $consulta);
$resultadoEgresos = mysqli_query($conn, $consulta_egresos);

if ($resultadoIngresos && $resultadoEgresos) {
    $datosIngresos = $resultadoIngresos->fetch_assoc();
    $datosEgresos = $resultadoEgresos->fetch_assoc();

    $respuesta = [
        "IngresoTotal" => $datosIngresos["IngresoTotal"] ?? 0,
        "IngresoEsteMes" => $datosIngresos["IngresoEsteMes"] ?? 0,
        "EgresoTotal" => $datosEgresos["EgresoTotal"] ?? 0,
        "EgresoEsteMes" => $datosEgresos["EgresoEsteMes"] ?? 0
    ];

    echo json_encode($respuesta);
} else {
    echo json_encode(["error" => "Error en la consulta"]);
}
?>
