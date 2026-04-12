<?php
// Inicia la sesión
session_start();


// Verifica si el usuario está autenticado y tiene el rol de admin
if (!isset($_SESSION['usuario'])) {
    // Si no es admin, redirige a otra página (por ejemplo, inicio de sesión o acceso denegado)
    header('Location: login.php');
    exit();
}

$permisos = isset($_SESSION['permisos']) ? $_SESSION['permisos'] : [];

?>

<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Inicio | MIECONOMIA</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" type="image/x-icon" href="../imagenes/logo.png">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="../css/ingreso.css" rel="stylesheet" type="text/css">
    <link href="../css/menu.css" rel="stylesheet" type="text/css">
    <link href="../css/adminInicio.css" rel="stylesheet" type="text/css">
    <link href="../css/adminusercrear.css" rel="stylesheet">
    <link href="../css/dashboard.css" rel="stylesheet">

    <script>
    // Pasa los permisos obtenidos desde PHP a JavaScript
        const permisos = <?php echo json_encode($_SESSION['permisos']); ?>;
    </script>


    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">

    <!-- jQuery (necesario para DataTables) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>

<body>

    <!-- encabezado con el logo de MIECONOMIA -->
    <header class="navbar bg-whitenavbar-expand-lg bg-light">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center w-100">
                <div class="d-flex align-items-center">
                    <h1 class="fs-3 my-2">MIECONOMIA</h1>
                    <img class="mx-3 d-none d-md-flex" src="../imagenes/logo.png" alt="Logo" width="50">
                </div>

                <!-- Usuario - Dropdown -->
            <div class="dropdown ms-auto d-flex align-items-center text-center">
                <a class="d-flex align-items-center text-center text-black text-decoration-none nav-link dropdown-toggle" 
                 id="PerfilDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="nombreUsuario" class="me-2 d-none d-md-flex"><?php echo $_SESSION['nombre']." ".$_SESSION['apellido']; ?></span>
                    <span id="rolUsuario" class="me-2 d-none d-md-flex">(<?php echo ucfirst($_SESSION['rol']); ?>)</span>
                    <img src="../imagenes/iconoUser.png" alt="user" width="50">
                </a>
    
                <!-- Menú desplegable -->
                <ul class="dropdown-menu dropdown-menu-end confUsuario" aria-labelledby="PerfilDropdown">
                    <li><a class="dropdown-item" href="#" onclick="cargarPagina('../html/Inicio/perfil.html',6)"><i class="bi bi-person-fill"></i>Mi Perfil</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="logout.php">Cerrar Sesión</a></li>
                </ul>
        </div>

    </header>

    <!-- Barra de navegación Los botones seran restringidos según el rol del usuario -->
    <div class="navbar navbar-expand-lg navbar-light sticky-top shadow menu">
    <div class="container-fluid">

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menuNav">
            <ul class="navbar-nav mx-auto">
                <!-- Opción de inicio siempre visible -->
                <li class="nav-item opcion fw-bold">
                    <a id="inicio" class="nav-link active" href="#" onclick="cargarPagina('../html/Administrador/AdminInicio.html',0)">
                        <i class="bi bi-speedometer2"></i> Inicio
                    </a>
                </li>

                <!-- Opción de ingresos visible solo para el rol admin -->
                <li class="nav-item opcion fw-bold" <?php if (!isset($_SESSION['permisos']['PaginaIngresos']) || $_SESSION['permisos']['PaginaIngresos'] != 1) echo 'style="display: none;"'; ?>>
                    <a id="ingresos" class="nav-link" href="#" onclick="cargarPagina('../html/Ingreso/ingresos.html',1)">
                        <i class="bi bi-cash-coin"></i> Ingresos
                    </a>
                </li>

                <!-- Opción de gastos visible solo para admin o egreso -->
                <li class="nav-item opcion fw-bold" <?php if (!isset($_SESSION['permisos']['PaginaGastos']) || $_SESSION['permisos']['PaginaGastos'] != 1) echo 'style="display: none;"'; ?>>
                    <a id="gastos" class="nav-link" href="#" onclick="cargarPagina('../html/Gasto/gastos.html',2)">
                        <i class="bi bi-credit-card"></i> Gastos
                    </a>
                </li>

                <!-- Opción de reportes visible según permisos -->
                <li class="nav-item opcion fw-bold" <?php if (!isset($_SESSION['permisos']['PaginaReportes']) || $_SESSION['permisos']['PaginaReportes'] != 1) echo 'style="display: none;"'; ?>>
                    <a id="reportes" class="nav-link" href="#" onclick="cargarPagina('../html/Reporte/reporte.html',3)">
                        <i class="bi bi-info-square"></i> Reportes
                    </a>
                </li>

                <!-- Dropdown de usuarios visible solo para admin -->
                <li class="nav-item dropdown opcion fw-bold menuNav" <?php if (!isset($_SESSION['permisos']['PaginaUsuario']) || $_SESSION['permisos']['PaginaUsuario'] != 1) echo 'style="display: none;"'; ?>>
                    <a class="nav-link dropdown-toggle" href="#" id="usuariosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-people-fill"></i> Usuarios
                    </a>
                    <ul class="dropdown-menu menu subNav-menu" aria-labelledby="usuariosDropdown">
                        <li><a class="dropdown-item" href="#" onclick="cargarPagina('../php/Admin/AdminUserLista.php',5)" <?php if (!isset($_SESSION['permisos']['ActivarDesactivarUsuario']) || $_SESSION['permisos']['ActivarDesactivarUsuario'] != 1) echo 'style="display: none;"'; ?> >
                                <i class="bi bi-person-lines-fill"></i> Lista de usuarios</a></li>
                        <li><a class="dropdown-item" href="#" onclick="cargarPagina('../php/Admin/AdminUserCrear.php',4)" <?php if (!isset($_SESSION['permisos']['CrearUsuario']) || $_SESSION['permisos']['CrearUsuario'] != 1) echo 'style="display: none;"'; ?>>
                                <i class="bi bi-person-fill-add"></i> Agregar usuario</a></li>
                        <li><a class="dropdown-item" href="#" onclick="cargarPagina('../html/Administrador/AdminPerfiles.html',7)" <?php if (!isset($_SESSION['permisos']['CrearRol']) || $_SESSION['permisos']['CrearRol'] != 1) echo 'style="display: none;"'; ?>>
                                <i class="bi bi-person-check-fill"></i> Gestionar Roles</a></li>
                    </ul>
                </li>

                <!-- Opción de categorias visible según permisos -->
                <li class="nav-item opcion fw-bold" <?php if (!isset($_SESSION['permisos']['PaginaCategorias']) || $_SESSION['permisos']['PaginaCategorias'] != 1) echo 'style="display: none;"'; ?>>
                    <a id="categorias" class="nav-link" href="#" onclick="cargarPagina('../html/Categorias/categorias.html',8)">
                        <i class="bi bi-tags"></i> Categorías
                    </a>
                </li>


                <li class="nav-item opcion fw-bold" <?php if (!isset($_SESSION['permisos']['PaginaAuditoria']) || $_SESSION['permisos']['PaginaAuditoria'] != 1) echo 'style="display: none;"'; ?>>
                    <a id="categorias" class="nav-link" href="#" onclick="cargarPagina('Auditoria/Auditoria.php',9)">
                    <i class="bi bi-book"></i> Auditoria
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>


    <!-- Contenido dinámico -->
    <div id="contenido" class="container mt-4">
            <!-- Aquí se cargará el contenido dinámico -->

    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="../javascript/PaginaPrincipal/cargarPaginas.js"></script>
    <script src="../javascript/Servicios/dashboard.js"></script>
    <script src="../javascript/Servicios/ingresos.js"></script>
    <script src="../javascript/Servicios/gastos.js"></script>
    <script src="../javascript/Servicios/perfil.js"></script>
    <script src="../javascript/Servicios/reportes.js"></script>
    <script src="../javascript/Servicios/perfiles.js"></script>
    <script src="../javascript/register_login/ingreso_usuario.js"></script>
    <script src="../javascript/Categoria/categoria.js"></script>
    <script src="../javascript/Servicios/usuarios_inactivos.js"></script>

</body>

</html>