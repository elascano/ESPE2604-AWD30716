<?php

$status = $_GET['status'] ?? '';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Customer</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <main class="container">
        <h1>Create Customer</h1>

        <?php if ($status === 'success'): ?>
            <p class="success-message">Customer saved successfully.</p>
        <?php endif; ?>

        <?php if ($status === 'error'): ?>
            <p class="error-message">Please complete all fields correctly.</p>
        <?php endif; ?>

        <form action="controllers/store_customer.php" method="POST">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>

            <label for="age">Age</label>
            <input type="number" id="age" name="age" min="1" required>

            <button type="submit">Save customer</button>
        </form>

        <a class="link-button" href="records.php">View records</a>
    </main>

</body>
</html>