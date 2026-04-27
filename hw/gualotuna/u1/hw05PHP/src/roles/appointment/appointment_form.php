<?php
require_once '../../../db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $patient_dni = $_POST['patient_dni'];
    $therapy = $_POST['therapy'];
    $app_date = $_POST['app_date'];

    $stmt = $pdo->prepare("INSERT INTO appointments (patient_dni, therapy, app_date) VALUES (?, ?, ?)");
    $stmt->execute([$patient_dni, $therapy, $app_date]);
    header("Location: appointment_table.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schedule Session</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar">
        <a href="../../../index.php" class="logo">
            <img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" alt="SER SALUD" class="logo-img">
        </a>
    </nav>
    <div class="form-wrapper">
        <form method="POST" action="">
            <h2>Schedule Therapy Session</h2>
            <div class="form-group">
                <label>Patient DNI</label>
                <input type="text" name="patient_dni" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Therapy Area</label>
                <select name="therapy" class="form-control" required>
                    <option value="Traumatological">Traumatological</option>
                    <option value="Neurological">Neurological</option>
                    <option value="Sports">Sports</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" name="app_date" class="form-control" required>
            </div>
            <button type="submit" class="btn-primary">Confirm Booking</button>
        </form>
    </div>
</body>
</html>