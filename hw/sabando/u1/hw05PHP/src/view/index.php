<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../styles/style.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

    <div class="form-container">
        <h2>Data Entry</h2>
        <form action="../controller/insertar.php" method="POST">
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Name" required>
            </div>

            <div class="input-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Email" required>
            </div>

            <div class="input-group">
                <label>Age</label>
                <input type="number" name="age" placeholder="Age" required>
            </div>

            <button type="submit" id="btnEnviar">Send Info</button>
        </form>
    </div>

    <script src="../model/script.js"></script>
</body>
</html>