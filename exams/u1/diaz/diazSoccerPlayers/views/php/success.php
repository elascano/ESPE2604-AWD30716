<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register sucessfull</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/user-views.css">
    <link rel="stylesheet" href="../css/forms.css">
</head>

<body class="bg-light">

    <header class="bg-primary shadow-sm">
        <h1 class="text-white m-0">Live Futbol</h1>
    </header>

    <main class="form-container">
        <div class="form-card shadow-sm text-center">
            <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success fs-1"></i>
                <h2 class="text-success fw-bold mt-2">¡Exit Register!</h2>
                <p class="text-muted">Exit register in the database</p>
            </div>

            <div class="actions-row d-flex justify-content-center gap-3 flex-wrap">
                <?php
                $type = $_GET['type'] ?? '';
                
                if ($type === 'player') {
                    echo '<a href="../html/player-form.html" class="btn btn-secondary">Add another player</a>';
                    echo '<a href="./player-list.php" class="btn btn-primary">View Players</a>';
                } 
                ?>
            </div>

            <hr class="my-4 opacity-25">

            <div class="d-grid gap-2 col-md-6 mx-auto">
                <a href="../html/register.html" class="btn btn-outline-secondary">Go to panel</a>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>