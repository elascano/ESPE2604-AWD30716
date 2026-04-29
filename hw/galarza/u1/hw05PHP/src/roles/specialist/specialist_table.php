<?php
require_once '../../../db.php';
$specialists = $pdo->query("SELECT * FROM specialists")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Staff Roster - SER SALUD</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar"><a href="../../../index.php" class="logo"><img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" class="logo-img"></a></nav>
    <div class="table-wrapper">
        <h2>Active Specialists</h2>
        <input type="text" id="searchInput" class="form-control" onkeyup="filterTable()" placeholder="Search staff...">
        <table class="styled-table">
            <thead><tr><th>Full Name</th><th>Specialty</th></tr></thead>
            <tbody id="tableBody">
                <?php foreach ($specialists as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row['full_name']) ?></td>
                    <td><?= htmlspecialchars($row['specialty']) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <script src="../../js/app.js"></script>
</body>
</html>