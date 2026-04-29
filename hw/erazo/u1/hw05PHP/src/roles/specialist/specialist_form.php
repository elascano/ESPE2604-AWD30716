<?php
require_once '../../../db.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $stmt = $pdo->prepare("INSERT INTO specialists (full_name, specialty) VALUES (?, ?)");
    $stmt->execute([$_POST['full_name'], $_POST['specialty']]);
    header("Location: specialist_table.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Specialist - SER SALUD</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar"><a href="../../../index.php" class="logo"><img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" class="logo-img"></a></nav>
    <div class="form-wrapper">
        <form method="POST">
            <h2>Register Professional</h2>
            <div class="form-group"><label>Full Name</label><input type="text" name="full_name" class="form-control" required></div>
            <div class="form-group"><label>Primary Specialty</label><input type="text" name="specialty" class="form-control" required></div>
            <button type="submit" class="btn-primary">Add to Roster</button>
        </form>
    </div>
</body>
</html>