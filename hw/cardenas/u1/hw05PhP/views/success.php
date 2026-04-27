<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro Exitoso - Fábula Dental</title>
    <link rel="stylesheet" href="../public/css/forms.css">
</head>
<body>
    <header>
        <h1>Fábula Dental</h1>
    </header>
    <main class="form-container">
        <div class="form-card" style="text-align: center;">
            <h2 style="color: #2e7d32;">¡Registro Exitoso!</h2>
            <p>El registro se ha guardado correctamente en la base de datos.</p>
            <br>
            <div class="actions-row" style="justify-content: center; gap: 15px;">
                <?php
                $type = $_GET['type'] ?? '';
                if ($type === 'patient') {
                    echo '<a href="./patient-form.php" class="btn btn-secondary">Añadir otro paciente</a>';
                    echo '<a href="./patient-list.php" class="btn btn-primary">Ver pacientes</a>';
                } elseif ($type === 'payment') {
                    echo '<a href="./payment-form.php" class="btn btn-secondary">Añadir otro abono</a>';
                    echo '<a href="./payment-list.php" class="btn btn-primary">Ver pagos</a>';
                } elseif ($type === 'supply') {
                    echo '<a href="./supply-form.php" class="btn btn-secondary">Añadir otro insumo</a>';
                    echo '<a href="./supply-list.php" class="btn btn-primary">Ver insumos</a>';
                }
                ?>
            </div>
            <br>
            <div>
                <a href="../index.php" class="btn btn-secondary">Ir al inicio</a>
            </div>
        </div>
    </main>
</body>
</html>
