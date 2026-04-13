<?php
// Inicia la sesión
session_start();

// Verifica si el usuario está autenticado y tiene el rol de admin
if (!isset($_SESSION['usuario']) || $_SESSION['rol'] != 'egreso') {
    // Si no es admin, redirige a otra página (por ejemplo, inicio de sesión o acceso denegado)
    header('Location: ../../html/Gasto/acceso_denegado.html');
    exit();
}

?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Administrador</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="icon" type="image/x-icon" href="../../imagenes/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
<link href="../../css/menu.css" rel="stylesheet" type="text/css">
<link href="../../css/ingreso.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
  <header class="navbar bg-whitenavbar-expand-lg bg-light">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center">
                <h1 class="fs-3 my-2">MIECONOMIA</h1>
                <img class="mx-3 d-none d-md-flex" src="../../imagenes/logo.png" alt="Logo" width="50">
            </div>

            <div class="ms-auto d-flex align-items-center text-center">
                <span id="nombreUsuario" class="me-2 d-none d-md-flex"><?php echo $_SESSION['usuario']; ?></span>
                <!-- Mostrar el rol directamente desde la sesión -->
                <span id="rolUsuario" class="me-2 d-none d-md-flex">(<?php echo ucfirst($_SESSION['rol']); ?>)</span>
                <i class="fs-4" id="user-icon">
                    <img src="../../imagenes/iconoUser.png" alt="user" width="50">
                </i>
            </div>
        </div>
    </div>
</header>

<div class="navbar navbar-expand-lg navbar-light sticky-top shadow menu">
  <div class="container-fluid">

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
          <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuNav">
          <ul class="navbar-nav mx-auto">
              <li class="nav-item opcion fw-bold"><a class="nav-link active" href="GastoInicio.php"><i class="bi bi-house"></i>
                      Inicio</a></li>
              <li class="nav-item opcion fw-bold"><a class="nav-link" href="../../html/Gasto/gastos.html"><i class="bi bi-credit-card"></i>
                      Gastos</a></li>
              <li class="nav-item opcion fw-bold"><a class="nav-link" href="#"><i class="bi bi-info-square"></i>
                      Reportes</a></li>
             
              </li>
          </ul>
      </div>
  </div>
</div>
</body>
</html>
