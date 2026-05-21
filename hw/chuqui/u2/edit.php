<?php
require_once 'models/Ride.php';

if (!isset($_GET['id'])) {
    header("Location: history.php");
    exit;
}

$id = $_GET['id'];
$ride = Ride::find($id);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    Ride::update($id, $_POST['Origin'], $_POST['Destination'], $_POST['Price']);
    header("Location: history.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Ride</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light mt-5 container">
    <div class="card shadow border-0 col-md-6 mx-auto p-4">
        <h4 class="mb-4">Edit Ride</h4>
        <form method="POST">
            <input type="text" name="Origin" class="form-control mb-3" value="<?= htmlspecialchars($ride['Origin']) ?>" required>
            <input type="text" name="Destination" class="form-control mb-3" value="<?= htmlspecialchars($ride['Destination']) ?>" required>
            <input type="number" name="Price" step="0.01" class="form-control mb-4" value="<?= htmlspecialchars($ride['Price']) ?>" required>
            <button type="submit" class="btn btn-warning w-100 fw-bold">Update</button>
            <a href="history.php" class="btn btn-light w-100 mt-2 border">Cancel</a>
        </form>
    </div>
</body>
</html>