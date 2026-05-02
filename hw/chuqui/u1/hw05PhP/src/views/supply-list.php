<?php
require '../vendor/autoload.php';
$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
$client = new MongoDB\Client($mongodbUri);
$collection = $client->FabulDentalDB->supplies;
$records = $collection->find();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Supplies - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
<header>
    <h1>Registered Supplies - Fábula Dental</h1>
</header>
<main class="form-container">
    <div class="form-card">
        <h2>Supply List</h2>
        <div class="table-wrap">
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Code</th>
                        <th>Initial Quantity</th>
                        <th>Unit Cost ($)</th>
                        <th>Purchase Date</th>
                        <th>Expiration Date</th>
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
            <a href="./supply-form.php" class="btn btn-secondary">Back to Form</a>
            <a href="../index.php" class="btn btn-primary">Go to Home</a>
        </div>
    </div>
</main>
</body>
</html>
