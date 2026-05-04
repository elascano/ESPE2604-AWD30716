<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menú del Restaurante</title>
	<link rel="stylesheet" href="../public/css/style_menu.css">
    <link rel="stylesheet" href="../public/css/style_index.css">
    <link href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" />
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

<div id="app">

    <h1>Restaurant Menu</h1>

    <div id="table"></div>

    <h3>Add Dish</h3>
    <input v-model="newDish.name" placeholder="Dish name">
    <input v-model="newDish.price" type="number" placeholder="Price">
    <button @click="addDish">Add</button>
    
</div>

<script src="https://unpkg.com/vue@3"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
<script src="https://unpkg.com/gridjs/dist/gridjs.umd.js"></script>
<script src="../public/js/app.js"></script>

</body>
</html>