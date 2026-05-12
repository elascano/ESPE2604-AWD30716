<?php

$status = $_GET['status'] ?? '';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Apartment</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <main class="container">
        <h1>Create Apartment</h1>

        <?php if ($status === 'success'): ?>
            <p class="success-message">Apartment saved successfully.</p>
        <?php endif; ?>

        <?php if ($status === 'error'): ?>
            <p class="error-message">Please complete all fields correctly.</p>
        <?php endif; ?>

        <form action="controllers/store_apartment.php" method="POST">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
            
            <label for="name">Number Of rooms</label>
            <input type="number" id="number_of_rooms" name="number_of_rooms"  min="1" required>

            <label for="age">Color</label>
            <input type="text" id="color" name="color" required>

            <button type="submit">Save Aparment</button>
        </form>

        <a class="link-button" href="records.php">View List</a>
    </main>

</body>
</html>