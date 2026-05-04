<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../public/css/style_forms.css">
    <link rel="stylesheet" href="../public/css/style_menu.css">
    <link rel="stylesheet" href="../public/css/style_index.css">
    <title>Login</title>
</head>

<body>

<header>
    <div class="logo">
        <a href="../index.php">
            <img src="../public/img/logoRestaurantGreen.png" alt="Logo Biconoir's" class="logo-img">
        </a>
    </div>
    <nav>
        <a href="menu.php">Ver menú</a>
        <a href="reservationForm.php" class="btn-reserva">Reservaciones</a>
        <a href="satisfactionForm.php">Encuestas de satisfacción</a>
        <a href="registerForm.php">Registrate</a>
		<a href="loginForm.php">Iniciar sesión</a>
    </nav>
</header>

<div id="content-spa" class="form-container">
    <div class="form-box">
        <h1>Login</h1>

        <form id="loginForm" onsubmit="validateAndSubmitLogin(event)">
            
            <fieldset class="form-section">
                <legend>ACCESS DATA</legend>

                <div class="form-group">
                    <label>Email or Username:</label>
                    <input type="text" name="user_identifier" id="user_identifier" required>
                </div>

                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" id="password" required>
                </div>

                <small id="loginError" class="error-text" style="color:red;"></small>

            </fieldset>

            <div class="form-actions">
                <input type="submit" value="Log In" class="btn btn-primary">

                <button type="button" onclick="window.history.back()" class="btn btn-danger">
                    Cancel
                </button>
            </div>

            <div class="form-group" style="margin-top: 10px;">
                <a href="#">Forgot your password?</a>
            </div>

        </form>
    </div>
</div>

<script src="../public/js/loginValidation.js"></script>

</body>
</html>