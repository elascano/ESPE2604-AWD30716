<?php
require '../vendor/autoload.php';
$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
$client = new MongoDB\Client($mongodbUri);
$collection = $client->FabulDentalDB->supplies;
$records = $collection->find();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insumos Registrados</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
<header>
    <h1>Insumos Registrados - Fábula Dental</h1>
</header>
<main class="form-container">
    <div class="form-card">
        <h2>Listado de insumos</h2>
        <div class="table-wrap">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Código</th>
                        <th>Cantidad Inicial</th>
                        <th>Costo Unitario ($)</th>
                        <th>Fecha Compra</th>
                        <th>Fecha Caducidad</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($records as $item): ?>
                    <tr>
                        <td><?= htmlspecialchars($item['productName'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['productCode'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['productInitialQuantity'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['productUnitCost'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['productPurchaseDate'] ?? '') ?></td>
                        <td><?= htmlspecialchars($item['productExpirationDate'] ?? '') ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <div class="actions-row">
            <a href="./supply-form.php" class="btn btn-secondary">Volver al formulario</a>
            <a href="../index.php" class="btn btn-primary">Ir al inicio</a>
        </div>
    </div>
</main>
</body>
</html>
