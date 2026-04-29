<?php
require '../vendor/autoload.php';
$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
$client = new MongoDB\Client($mongodbUri);
$collection = $client->FabulDentalDB->patients;
$records = $collection->find();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacientes Registrados</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
<header>
    <h1>Pacientes Registrados - Fábula Dental</h1>
</header>
<main class="form-container">
    <div class="form-card">
        <h2>Listado de pacientes</h2>
        <div class="table-wrap">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Nacimiento</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Género</th>
                        <th>Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($records as $item): ?>
                    <tr>
                        <td><?= htmlspecialchars($item['nombre'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['cedula'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['fecha'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['telefono'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['correo'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['genero'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['motivo'] ?? '') ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <div class="actions-row">
            <a href="./patient-form.php" class="btn btn-secondary">Volver al formulario</a>
            <a href="../index.php" class="btn btn-primary">Ir al inicio</a>
        </div>
    </div>
</main>
</body>
</html>
