<?php
session_start();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = 'Por favor, ingrese usuario y contraseña.';
    } else {
        if ($username === 'admin' && $password === 'Admin12!') {
            $_SESSION['user'] = $username;
            $_SESSION['role'] = 'administrator';
            header('Location: ./views/html/administrator.html');
            exit;
        } elseif ($username === 'dentist' && $password === 'Denti12!') {
            $_SESSION['user'] = $username;
            $_SESSION['role'] = 'dentist';
            header('Location: ./views/html/dentist.html');
            exit;
        } elseif ($username === 'reception' && $password === 'Recep12!') {
            $_SESSION['user'] = $username;
            $_SESSION['role'] = 'receptionist';
            header('Location: ./views/html/receptionist.html');
            exit;
        } else {
            $error = 'Usuario o contraseña incorrectos.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión | Fábula Dental</title>
    <link rel="stylesheet" href="views/css/login.css">
</head>

<body>
    <header class="header">
        <ul class="nav-links">
            <li><a href="index.php">INICIO</a></li>
            <li><a href="views/html/treatment.html">TRATAMIENTOS</a></li>
        </ul>
        <div class="nav-buttons">
            <a href="index.php" class="active">INGRESAR</a>
        </div>
    </header>

    <main class="main-content">
        <img src="https://fabuladental.com/wp-content/uploads/2023/08/EMPH-42_websize.jpg" alt="Fábula Dental Fondo" class="bg-image">

        <div class="login-container">
            <h2>Iniciar Sesión</h2>
            
            <?php if (!empty($error)): ?>
                <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            
            <form name="loginForm" id="loginForm" method="POST" action="index.php">
                <div class="input-group">
                    <input type="text" name="username" placeholder="Nombre de usuario" required maxlength="20">
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="Contraseña" required maxlength="8">
                </div>
                <button type="submit" class="login-btn">INGRESAR</button>
            </form>
        </div>
    </main>

    <script src="./views/js/login-validation.js"></script>
</body>

</html>