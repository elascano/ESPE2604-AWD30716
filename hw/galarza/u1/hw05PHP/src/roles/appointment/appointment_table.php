<?php
require_once '../../../db.php';
$appointments = $pdo->query("SELECT * FROM appointments")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Clinical Agenda - SER SALUD</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar"><a href="../../../index.php" class="logo">
        <img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" class="logo-img"></a></nav>
    <div class="table-wrapper">
        <h2>Appointment Schedule</h2>
        <table class="styled-table">
            <thead>
                <tr><th>Patient DNI</th><th>Therapy</th><th>Date</th></tr>
            </thead>
            <tbody>
                <?php foreach ($appointments as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row['patient_dni']) ?></td>
                    <td><?= htmlspecialchars($row['therapy']) ?></td>
                    <td><?= htmlspecialchars($row['app_date']) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>