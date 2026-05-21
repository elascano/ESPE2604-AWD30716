<?php
require_once 'models/Ride.php';

if (isset($_GET['delete_id'])) {
    Ride::delete($_GET['delete_id']);
    header("Location: history.php");
    exit;
}

$rides = Ride::getAll();
$totalRevenue = array_sum(array_column($rides, 'Price'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TaxiApp - History</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>
<body class="bg-light">
    <div class="container mt-5">
        
        <div class="d-flex justify-content-between align-items-center mb-4">
            <a href="index.php" class="btn btn-outline-dark fw-bold"><i class="fa-solid fa-arrow-left"></i> Back to Entry</a>
            <div class="bg-white p-2 px-4 rounded shadow-sm border-start border-success border-4 text-end">
                <span class="text-muted d-block" style="font-size: 0.8rem;">Daily Total Revenue</span>
                <span class="fs-4 fw-bold text-success">$<?= number_format($totalRevenue, 2) ?></span>
            </div>
        </div>

        <div class="card shadow-sm border-0 rounded-3">
            <div class="card-header bg-dark text-white p-3">
                <h4 class="mb-0"><i class="fa-solid fa-book-open text-warning me-2"></i> Recopilation of the Day</h4>
            </div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Route</th>
                            <th>Price</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($rides as $ride): ?>
                        <tr>
                            <td class="ps-4">
                                <?= htmlspecialchars($ride['Origin']) ?> 
                                <i class="fa-solid fa-arrow-right text-muted mx-2"></i> 
                                <?= htmlspecialchars($ride['Destination']) ?>
                            </td>
                            <td class="text-success fw-bold">$<?= number_format((float)$ride['Price'], 2) ?></td>
                            <td class="text-center">
                                <a href="edit.php?id=<?= $ride['_id'] ?>" class="btn btn-sm btn-outline-dark"><i class="fa-solid fa-edit"></i> Edit</a>
                                <a href="history.php?delete_id=<?= $ride['_id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this ride?');"><i class="fa-solid fa-trash"></i></a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>