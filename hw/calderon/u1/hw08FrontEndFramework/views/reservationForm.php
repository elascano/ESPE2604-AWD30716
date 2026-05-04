<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../public/css/style_forms.css">
    <link rel="stylesheet" href="../public/css/style_menu.css">
    <link rel="stylesheet" href="../public/css/style_index.css">
    <title>Reservaciones</title>
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

<div id="contenido-spa" class="form-container">

    <div class="form-box">
        <h1>New Reservation</h1>

        <form id="reservationForm" onsubmit="handleReservation(event)">

            <fieldset class="form-section">
                <legend>CLIENT DATA</legend>

                <div class="form-group">
                    <label>Names:</label>
                    <input type="text" name="first_name" required>
                </div>

                <div class="form-group">
                    <label>Surnames:</label>
                    <input type="text" name="last_name" required>
                </div>

                <div class="form-group">
                    <label>Phone:</label>
                    <input type="text" name="phone" maxlength="10" required>
                </div>

                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email">
                </div>

            </fieldset>

            <fieldset class="form-section">
                <legend>RESERVATION DETAILS</legend>

                <div class="form-group">
                    <label>Date:</label>
                    <input type="date" name="reservation_date" required>
                </div>

                <div class="form-group">
                    <label>Time:</label>
                    <input type="time" name="reservation_time" required>
                </div>

                <div class="form-group">
                    <label>Guests:</label>
                    <input type="number" name="guests" min="1" max="20" required>
                </div>

                <div class="form-group">
                    <label>Table:</label>
                    <select name="table_number">
                        <option value="">Select</option>
                        <option value="1">Table 1</option>
                        <option value="2">Table 2</option>
                        <option value="3">Table 3</option>
                        <option value="4">Table 4</option>
                        <option value="5">Table 5</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Observations:</label>
                    <input type="text" name="comments">
                </div>

            </fieldset>

            <div class="form-actions">
                <input type="submit" value="Reserve" class="btn btn-primary">

                <button type="button" class="btn btn-danger">
                    Cancel
                </button>
            </div>

        </form>

    </div>

</div>

<script src="../public/js/reservationLogic.js"></script>
</body>
</html>