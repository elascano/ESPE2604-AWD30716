<?php
require '../vendor/autoload.php';
$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
$client = new MongoDB\Client($mongodbUri);
$collection = $client->FabulDentalDB->patients;
$records = $collection->find();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Patients - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
<header>
    <h1>Registered Patients - Fábula Dental</h1>
</header>
<main class="form-container">
    <div class="form-card">
        <h2>Patient List</h2>
        <div class="table-wrap">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID Card</th>
                        <th>Date of Birth</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Reason for Visit</th>
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
            <a href="./patient-form.php" class="btn btn-secondary">Back to Form</a>
            <a href="../index.php" class="btn btn-primary">Go to Home</a>
        </div>
    </div>
</main>
</body>
</html>
