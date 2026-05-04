<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Successful Registration - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
    <header>
        <h1>Fábula Dental</h1>
    </header>
    <main class="form-container">
        <div class="form-card" style="text-align: center;">
            <h2 style="color: #2e7d32;">Registration Successful!</h2>
            <p>The record has been successfully saved in the database.</p>
            <br>
            <div class="actions-row" style="justify-content: center; gap: 15px;">
                <?php
                $type = $_GET['type'] ?? '';
                if ($type === 'patient') {
                    echo '<a href="./patient-form.php" class="btn btn-secondary">Add another patient</a>';
                    echo '<a href="./patient-list.php" class="btn btn-primary">View patients</a>';
                } elseif ($type === 'payment') {
                    echo '<a href="./payment-form.php" class="btn btn-secondary">Add another payment</a>';
                    echo '<a href="./payment-list.php" class="btn btn-primary">View payments</a>';
                } elseif ($type === 'supply') {
                    echo '<a href="./supply-form.php" class="btn btn-secondary">Add another supply</a>';
                    echo '<a href="./supply-list.php" class="btn btn-primary">View supplies</a>';
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
