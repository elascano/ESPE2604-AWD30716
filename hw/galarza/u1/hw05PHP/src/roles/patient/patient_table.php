<?php
require_once '../../../db.php';
$stmt = $pdo->query("SELECT * FROM patients");
$patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Records</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar">
        <a href="../../../index.php" class="logo">
            <img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" alt="SER SALUD" class="logo-img">
        </a>
    </nav>
    <div class="table-wrapper">
        <h2>Registered Patients</h2>
        <input type="text" id="searchInput" class="form-control" onkeyup="filterTable()" placeholder="Search records...">
        <table class="styled-table">
            <thead>
                <tr>
                    <th>DNI</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody id="tableBody">
                <?php foreach ($patients as $p): ?>
                <tr>
                    <td><?php echo htmlspecialchars($p['dni']); ?></td>
                    <td><?php echo htmlspecialchars($p['full_name']); ?></td>
                    <td><?php echo htmlspecialchars($p['email']); ?></td>
                    <td><?php echo htmlspecialchars($p['phone']); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <script src="../../js/app.js"></script>
</body>
</html>