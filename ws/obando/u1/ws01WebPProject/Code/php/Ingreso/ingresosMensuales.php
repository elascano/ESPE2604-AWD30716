<?php
include("../conexion.php");

// Consulta para obtener los ingresos por mes, solo con los registros Completados
$consultaIngresos = 'SELECT MONTH(Fecha) AS mes, SUM(Monto) AS total_ingresos 
                     FROM ingresos 
                     WHERE YEAR(Fecha) = YEAR(CURDATE()) 
                     AND Estado = "Completado"
                     GROUP BY mes 
                     ORDER BY mes';

$resultadoIngresos = mysqli_query($conn, $consultaIngresos);

// Consulta para obtener los egresos por mes, solo con los registros Completados
$consultaEgresos = 'SELECT MONTH(Fecha) AS mes, SUM(Monto) AS total_egresos 
                    FROM egresos 
                    WHERE YEAR(Fecha) = YEAR(CURDATE()) 
                    AND Estado = "Completado"
                    GROUP BY mes 
                    ORDER BY mes';


$resultadoEgresos = mysqli_query($conn, $consultaEgresos);

// Inicializamos los arrays para almacenar los resultados de ingresos y egresos
$ingresosData = array_fill(1, 12, 0); // Inicializa todos los meses con 0
$egresosData = array_fill(1, 12, 0);  // Inicializa todos los meses con 0

// Obtenemos los datos de ingresos por mes
if ($resultadoIngresos) {
    while ($row = $resultadoIngresos->fetch_assoc()) {
        $ingresosData[$row['mes']] = $row['total_ingresos'];
    }
} else {
    echo json_encode(["error" => "Error en la consulta de ingresos"]);
    exit();
}

// Obtenemos los datos de egresos por mes
if ($resultadoEgresos) {
    while ($row = $resultadoEgresos->fetch_assoc()) {
        $egresosData[$row['mes']] = $row['total_egresos'];
    }
} else {
    echo json_encode(["error" => "Error en la consulta de egresos"]);
    exit();
}

// Combinamos los datos de ingresos y egresos para la gráfica
$graficaData = [];
for ($mes = 1; $mes <= 12; $mes++) {
    $graficaData[] = [
        "mes" => $mes,
        "total_ingresos" => $ingresosData[$mes],
        "total_egresos" => $egresosData[$mes]
    ];
}

echo json_encode($graficaData);
?>
