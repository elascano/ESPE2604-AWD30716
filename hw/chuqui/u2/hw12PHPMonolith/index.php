<?php
require_once 'models/Ride.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    Ride::create($_POST['Origin'], $_POST['Destination'], $_POST['Price']);
    // Muestra un mensaje de éxito sin cambiar de página
    $successMessage = "Ride saved successfully!";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TaxiApp - New Ride</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                
                <?php if(isset($successMessage)): ?>
                    <div class="alert alert-success fw-bold"><i class="fa-solid fa-check-circle"></i> <?= $successMessage ?></div>
                <?php endif; ?>

                <div class="card shadow-lg border-0 rounded-3 mb-4">
                    <div class="card-header bg-dark text-white p-4 text-center">
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
                                <input type="number" name="Price" step="0.01" class="form-control fw-bold text-success fs-5" placeholder="0.00" required>
                            </div>
                            <button type="submit" class="btn btn-dark btn-lg w-100"><i class="fa-solid fa-save text-warning"></i> Save Ride</button>
                        </form>
                    </div>
                </div>

                <a href="history.php" class="btn btn-warning btn-lg w-100 fw-bold shadow-sm">
                    <i class="fa-solid fa-list-check"></i> Go to Daily Recopilation
                </a>
            </div>
        </div>
    </div>
</body>
</html>