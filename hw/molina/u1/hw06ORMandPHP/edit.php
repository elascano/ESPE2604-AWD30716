<?php

require_once __DIR__ . '/config/database.php';

use RedBeanPHP\R;

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    header('Location: records.php');
    exit;
}

$customer = R::load('customer', (int) $id);

if (!$customer->id) {
    header('Location: records.php');
    exit;
}

$status = $_GET['status'] ?? '';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Customer</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <main class="container">
        <h1>Edit Customer</h1>

        <?php if ($status === 'error'): ?>
            <p class="error-message">Please complete all fields correctly.</p>
        <?php endif; ?>

        <form action="controllers/update_customer.php" method="POST">
            <input type="hidden" name="id" value="<?= htmlspecialchars($customer->id) ?>">

            <label for="name">Name</label>
            <input 
                type="text" 
                id="name" 
                name="name" 
                value="<?= htmlspecialchars($customer->name) ?>" 
                required
            >

            <label for="age">Age</label>
            <input 
                type="number" 
                id="age" 
                name="age" 
                min="1" 
                value="<?= htmlspecialchars($customer->age) ?>" 
                required
            >

            <button type="submit">Update customer</button>
        </form>

        <a class="link-button" href="records.php">Back to records</a>
    </main>

</body>
</html>