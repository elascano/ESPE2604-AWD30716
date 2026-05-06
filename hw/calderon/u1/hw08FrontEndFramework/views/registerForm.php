<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../public/css/style_forms.css">
    <link rel="stylesheet" href="../public/css/style_menu.css">
    <link rel="stylesheet" href="../public/css/style_index.css">
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
        <h1>New User</h1>

        <form id="registrationForm" onsubmit="validateAndSubmitForm(event)">
            
            <fieldset class="form-section">
                <legend>PERSONAL DATA</legend>
                
                <div class="form-group">
                    <label>Names:</label>
                    <input type="text" name="first_name" id="first_name" required>
                </div>

                <div class="form-group">
                    <label>Surnames:</label>
                    <input type="text" name="last_name" id="last_name" required>
                </div>

                <div class="form-group">
                    <label>Id Number:</label>
                    <input type="text" name="id_number" id="id_number" maxlength="10" required>
                    <small id="idError" class="error-text" style="color: red;"></small>
                </div>

                <div class="form-group">
                    <label>Birth Date:</label>
                    <input type="date" name="birth_date" id="birth_date" onchange="calculateAge()" required>
                </div>

                <div class="form-group">
                    <label>Age:</label>
                    <input type="text" name="age" id="age" readonly class="readonly">
                </div>

                <div class="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" id="address">
                </div>

                <div class="form-group">
                    <label>Phone:</label>
                    <input type="text" name="phone" id="phone" maxlength="10">
                </div>
            </fieldset>

            <div class="form-actions">
                <input type="submit" value="Register" class="btn btn-primary">
                <button type="button" onclick="window.history.back()" class="btn btn-danger">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

<script src="../public/js/registerValidation.js"></script>
</body>
</html>