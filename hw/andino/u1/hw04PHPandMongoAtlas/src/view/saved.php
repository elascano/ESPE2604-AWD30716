<?php
$insertedId = htmlspecialchars($_GET['id'] ?? '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="3;url=/src/view/index.html">
    <title>Customer Saved</title>
    <link rel="stylesheet" href="/src/public/css/styleSaved.css">
</head>
<body>
    <main class="saved-page">
        <section class="card">
            <h1>Customer saved successfully</h1>
            <p>The record was saved in MongoDB Atlas with the following identifier:</p>
            <p><strong><?php echo $insertedId; ?></strong></p>
            <p class="meta">Returning to the form in 3 seconds</p>
        </section>
        <footer class="site-footer">All rights reserved ESPE - Nelson Andino</footer>
    </main>
</body>
</html>