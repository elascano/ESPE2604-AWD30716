<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../public/css/style_forms.css">
    <link rel="stylesheet" href="../public/css/style_menu.css">
    <link rel="stylesheet" href="../public/css/style_index.css">
    <title>Encuesta de Satisfacción</title>
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
        <h1>Customer Satisfaction Survey</h1>

        <form id="surveyForm" onsubmit="handleSurvey(event)">

            <fieldset class="form-section">
                <legend>CLIENT DATA</legend>

                <div class="form-group">
                    <label>Names:</label>
                    <input type="text" name="first_name" required>
                </div>

                <div class="form-group">
                    <label>Surnames:</label>
                    <input type="text" name="last_name">
                </div>

                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email">
                </div>

                <div class="form-group">
                    <label>Visit Date:</label>
                    <input type="date" name="visit_date" required>
                </div>
            </fieldset>

            <fieldset class="form-section">
                <legend>EVALUATION</legend>

                <div class="form-group">
                    <label>Food Quality:</label>
                    <select name="food_quality" required>
                        <option value="">Select</option>
                        <option value="5">Excellent</option>
                        <option value="4">Very Good</option>
                        <option value="3">Good</option>
                        <option value="2">Regular</option>
                        <option value="1">Bad</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Service Quality:</label>
                    <select name="service_quality" required>
                        <option value="">Select</option>
                        <option value="5">Excellent</option>
                        <option value="4">Very Good</option>
                        <option value="3">Good</option>
                        <option value="2">Regular</option>
                        <option value="1">Bad</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Cleanliness:</label>
                    <select name="cleanliness" required>
                        <option value="">Select</option>
                        <option value="5">Excellent</option>
                        <option value="4">Very Good</option>
                        <option value="3">Good</option>
                        <option value="2">Regular</option>
                        <option value="1">Bad</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Would you recommend us?</label>
                    <select name="recommendation" required>
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Comments:</label>
                    <input type="text" name="comments">
                </div>

            </fieldset>

            <div class="form-actions">
                <input type="submit" value="Submit" class="btn btn-primary">

                <button type="button" class="btn btn-danger">
                    Cancel
                </button>
            </div>

        </form>

    </div>

</div>

<script src="../public/js/surveyLogic.js"></script>
</body>
</html>