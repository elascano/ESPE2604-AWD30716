
<?php
include('../../php/Conexionconexion.php');
$consulta = 'select * from usuarios';
$resultado = mysqli_query($conexion,$consulta);
$tabla =<<<FIN
<table>
<tr><th>I</th><th>Id</th><th>Cedula</th><th>Cedula</th><th>Email</th><th>Estado</th><th colspan="2">Accion</th></tr>
FIN;

while($registro=mysqli_fetch_assoc($resultado)){
    $tabla.='<tr>';
	$tabla.="<td>{$registro['Id']}</td>";
    $tabla.="<td>{$registro['Nombre']}</td>";
    $tabla.="<td>{$registro['Apellido']}</td>";
    $tabla.="<td>{$registro['Cedula']}</td>";
    $tabla.="<td>{$registro['email']}</td>";
	$tabla.="<td>{$registro['Estado']}</td>";
    $tabla.="<td><a href=borrar.php?Id={$registro['Id']}>Borrar</a></td>";
	 $tabla.="<td><a href=activar.php?Id={$registro['Id']}>Activar</a></td>";
    $tabla.="<td><a href=editar.php?Id={$registro['Id']}>Editar</a></td>";
    $tabla.='</tr>';
}
$tabla.='</table>';
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
                <span id="nombreUsuario" class="me-2 d-none d-md-flex">Nombre Apellido</span>
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
              <li class="nav-item opcion fw-bold"><a class="nav-link" href="#"><i class="bi bi-house"></i>
                      Inicio</a></li>
              <li class="nav-item opcion fw-bold"><a class="nav-link active" href="#"><i
                          class="bi bi-cash-coin"></i>
                      Ingresos</a></li>
              <li class="nav-item opcion fw-bold"><a class="nav-link" href="#"><i class="bi bi-credit-card"></i>
                      Gastos</a></li>
              <li class="nav-item opcion fw-bold"><a class="nav-link" href="#"><i class="bi bi-info-square"></i>
                      Reportes</a></li>
              <li class="nav-item dropdown opcion fw-bold">
                  <a class="nav-link dropdown-toggle" href="#" id="usuariosDropdown" role="button"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="bi bi-people-fill"></i> Usuarios
                  </a>
                  <ul class="dropdown-menu menu" aria-labelledby="usuariosDropdown">
                      <li><a class="dropdown-item" href="../../php/AdminUserLista.php"><i class="bi bi-person-lines-fill"></i> Lista de
                              usuarios</a></li>
                      <li><a class="dropdown-item" href="AdminUserCrear.html"><i class="bi bi-person-fill-add"></i> Agregar
                              usuario</a></li>
                      <li><a class="dropdown-item" href="AdminUserRoles.html"><i class="bi bi-person-check-fill"></i> Administrar
                              permisos</a></li>
                  </ul>
              </li>
          </ul>
      </div>
  </div>
</div>
<h1 style="text-align: center;">Lista Usuarios</h1>
<div class="contenido">
    <div class="tabla">
    <?php echo $tabla; ?>
    <p>
    <a href="../html/registro/registro.html">Registrar</a>
    </p>
    </div>

    </div>


</body>
</html>
