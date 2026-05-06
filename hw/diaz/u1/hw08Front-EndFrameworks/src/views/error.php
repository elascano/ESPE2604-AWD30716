<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Error - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
    <header>
        <h1>Fábula Dental</h1>
    </header>
    <main class="form-container">
        <div class="form-card" style="text-align: center;">
            <h2 style="color: #c62828;">Error Registering!</h2>
            <p>There was a problem trying to save the information in the database. Please try again.</p>
            <br>
            <div class="actions-row" style="justify-content: center; gap: 15px;">
                <?php
                $type = $_GET['type'] ?? '';
                if ($type === 'patient') {
                    echo '<a href="./patient-form.php" class="btn btn-primary">Back to form</a>';
                } elseif ($type === 'payment') {
                    echo '<a href="./payment-form.php" class="btn btn-primary">Back to form</a>';
                } elseif ($type === 'supply') {
                    echo '<a href="./supply-form.php" class="btn btn-primary">Back to form</a>';
                }
                ?>
            </div>
            <br>
            <div>
                <a href="../index.php" class="btn btn-secondary">Go to Home</a>
            </div>
        </div>
    </main>
</body>
</html>
