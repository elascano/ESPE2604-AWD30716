<?php
include '../conexion.php'; // Conexión a la base de datos

// Consulta SQL para obtener los datos de auditoría de múltiples tablas
$sql = "SELECT fecha_hora, usuario_nombre, usuario_apellido, tabla_afectada, accion, valor_antes, valor_despues 
        FROM auditoria 
        WHERE tabla_afectada IN ('usuarios', 'ingresos', 'egresos', 'categorias', 'perfiles')
        ORDER BY fecha_hora DESC";

$result = $conn->query($sql);

if ($result === false) {
    die("Error en la consulta: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auditoría del Sistema</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
    </style>
</head>
<body>
    <h2>Registro de Auditoría</h2>
    <table>
        <thead>
            <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Tabla Modificada</th>
                <th>Acción</th>
                <th>Detalles Antes</th>
                <th>Detalles Después</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()) { ?>
                <tr>
                    <td><?= date('d/m/Y H:i:s', strtotime($row['fecha_hora'])) ?></td>
                    <td><?= htmlspecialchars($row['usuario_nombre'] . ' ' . $row['usuario_apellido']) ?></td>
                    <td><?= htmlspecialchars($row['tabla_afectada']) ?></td>
                    <td><?= htmlspecialchars($row['accion']) ?></td>
                    <td><?= htmlspecialchars($row['valor_antes']) ?></td>
                    <td><?= htmlspecialchars($row['valor_despues']) ?></td>
                </tr>
            <?php } ?>
        </tbody>
    </table>
</body>
</html>
