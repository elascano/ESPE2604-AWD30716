<?php
session_start();

$unauthorized = isset($_GET['unauthorized']) && $_GET['unauthorized'] === 'true';
$error = $_GET['error'] ?? '';

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Dental Fable</title>
    <link rel="stylesheet" href="views/css/login.css">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>

<body x-data="{ unauthorized: <?php echo json_encode($unauthorized); ?> }">
    <header class="header">
        <ul class="nav-links">
            <li><a href="index.php">HOME</a></li>
            <li><a href="views/html/treatment.html">TREATMENTS</a></li>
        </ul>
        <div class="nav-buttons">
            <a href="index.php" class="active">LOGIN</a>
        </div>
    </header>

    <main class="main-content">
        <img src="https://fabuladental.com/wp-content/uploads/2023/08/EMPH-42_websize.jpg" alt="Dental Fable Background" class="bg-image">

        <div class="login-container">
            <div x-show="unauthorized" class="unauthorized-msg">
                <p>You are not logged in. Do you want to log in?</p>
                <br>
                <a href="auth/login.php" class="login-btn">Yes, log in</a>
            </div>

            <div x-show="!unauthorized">
                <h2>Login</h2>
                
                <?php if (!empty($error)): ?>
                    <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <a href="auth/login.php" class="login-btn google-login-btn">
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo">
                    
                    Sign in with Google
                </a>
            </div>
        </div>
    </main>

</body>

</html>