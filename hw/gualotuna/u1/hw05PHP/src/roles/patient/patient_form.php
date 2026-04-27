<?php
require_once '../../../db.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $stmt = $pdo->prepare("INSERT INTO patients (dni, full_name, email, phone) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_POST['dni'], $_POST['full_name'], $_POST['email'], $_POST['phone']]);
    header("Location: patient_table.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Patient - SER SALUD</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar"><a href="../../../index.php" class="logo"><img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" class="logo-img"></a></nav>
    <div class="form-wrapper">
        <form method="POST">
            <h2>Patient Registration</h2>
            <div class="form-group"><label>DNI</label><input type="text" name="dni" class="form-control" required></div>
            <div class="form-group"><label>Full Name</label><input type="text" name="full_name" class="form-control" required></div>
            <div class="form-group"><label>Email</label><input type="email" name="email" class="form-control" required></div>
            <div class="form-group"><label>Phone</label><input type="text" name="phone" class="form-control" required></div>
            <button type="submit" class="btn-primary">Save Patient</button>
        </form>
    </div>
</body>
</html>