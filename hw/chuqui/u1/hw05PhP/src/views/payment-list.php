<?php
require '../vendor/autoload.php';
$mongodbUri = 'mongodb+srv://kachuqui_db_user:abtCJQPiKpKhMBz6@cluster0.x7strgx.mongodb.net/?appName=Cluster0';
$client = new MongoDB\Client($mongodbUri);
$collection = $client->FabulDentalDB->payments;
$records = $collection->find();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered Payments - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>

<body>
    <header>
        <h1>Registered Payments - Fábula Dental</h1>
    </header>
    <main class="form-container">
        <div class="form-card">
            <h2>Payment List</h2>
            <div class="table-wrap">
                <table class="records-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Amount ($)</th>
                            <th>Date</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                            <?php foreach ($records as $item): ?>
                            <tr>
                                <td><?= htmlspecialchars($item['patientId'] ?? '') ?></td>
                                <td><?= htmlspecialchars($item['paymentAmount'] ?? '') ?></td>
                                <td><?= htmlspecialchars($item['paymentDate'] ?? '') ?></td>
                                <td><?= htmlspecialchars($item['paymentMethod'] ?? '') ?></td>
                            </tr>
                            <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <div class="actions-row">
                <a href="./payment-form.php" class="btn btn-secondary">Back to Form</a>
                <a href="../index.php" class="btn btn-primary">Go to Home</a>
            </div>
        </div>
    </main>
</body>

</html>
