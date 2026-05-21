<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $ridesCollection->insertOne([
        'Origin' => $_POST['Origin'],
        'Destination' => $_POST['Destination'],
        'Price' => (float)$_POST['Price'],
        'Date' => new MongoDB\BSON\UTCDateTime()
    ]);
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Ride - TaxiApp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow-lg border-0 rounded-3">
                    <div class="card-header bg-dark text-white p-4">
                        <h3 class="mb-0"><i class="fa-solid fa-location-dot text-warning me-2"></i> Register New Ride</h3>
                    </div>
                    <div class="card-body p-4">
                        <form method="POST">
                            <div class="row mb-3">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <label class="form-label fw-bold">Origin</label>
                                    <input type="text" name="Origin" class="form-control" placeholder="e.g. Airport" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Destination</label>
                                    <input type="text" name="Destination" class="form-control" placeholder="e.g. Downtown" required>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold">Total Price ($)</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-warning text-dark fw-bold">$</span>
                                    <input type="number" name="Price" step="0.01" class="form-control fw-bold text-success" placeholder="0.00" required>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <a href="index.php" class="btn btn-outline-secondary btn-lg px-4"><i class="fa-solid fa-arrow-left"></i> Back</a>
                                <button type="submit" class="btn btn-dark btn-lg px-5"><i class="fa-solid fa-save text-warning"></i> Save Ride</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>