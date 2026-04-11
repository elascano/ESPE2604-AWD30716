<?php
session_start();

/* ===== EVITAR CACHE ===== */
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

/* ===== SEGURIDAD ===== */
if (!isset($_SESSION['usuario'])) {
    header("Location: ../index.php");
    exit;
}

/* ================= SEGURIDAD BÁSICA ================= */
$tiempo_inactividad = 300;

if (isset($_SESSION['ultima_actividad'])) {
    if ((time() - $_SESSION['ultima_actividad']) > $tiempo_inactividad) {
        session_unset();
        session_destroy();
        header("Location: ../index.php?timeout=1");
        exit;
    }
}
$_SESSION['ultima_actividad'] = time();

if (!isset($_SESSION['usuario'])) {
    header("Location: ../index.php");
    exit;
}

$permisos = $_SESSION['permisos'] ?? [];
?>
<!DOCTYPE html>
<html lang="es">
<head>
<title>Panel Principal</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="stylesheet" href="../estilos/estilos.css">
<link rel="stylesheet" href="../estilos/w3.css">
<link rel="stylesheet" href="../estilos/font-awesome.min.css">

<style>
body { font-family: "Lato", sans-serif; }
</style>

<script>
function actualizarReloj() {
    const now = new Date();
    document.getElementById("reloj").innerHTML =
        now.toLocaleDateString() + " " + now.toLocaleTimeString();
}
setInterval(actualizarReloj, 1000);
</script>
</head>

<body onload="actualizarReloj()">

<!-- ================= BARRA DE NAVEGACIÓN ================= -->
<div class="w3-top">
  <div class="w3-bar w3-blue w3-card">

<!-- ================= MENÚ USUARIOS ================= -->
<?php
$menuUsuarios = [
    'usuario_ingresar',
    'usuario_listar',
    'usuario_editar',
    'usuario_eliminar'
];
if (count(array_intersect($menuUsuarios, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    USUARIOS <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('usuario_ingresar', $permisos)): ?>
      <a href="inicio.php?op=usuario_ingresar" class="w3-bar-item w3-button">Ingresar</a>
    <?php endif; ?>

    <?php if (in_array('usuario_listar', $permisos)): ?>
      <a href="inicio.php?op=usuario_listar" class="w3-bar-item w3-button">Listar</a>
    <?php endif; ?>

    <?php if (in_array('usuario_editar', $permisos)): ?>
      <a href="inicio.php?op=usuario_editar_buscar" class="w3-bar-item w3-button">Editar</a>
    <?php endif; ?>

    <?php if (in_array('usuario_eliminar', $permisos)): ?>
      <a href="inicio.php?op=usuario_eliminar" class="w3-bar-item w3-button">Eliminar</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>

<!-- ================= MENÚ ROLES ================= -->
<?php
$menuRoles = [
    'rol_ingresar',
    'rol_listar',
    'rol_editar',
    'rol_eliminar'
];
if (count(array_intersect($menuRoles, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    ROLES <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('rol_ingresar', $permisos)): ?>
      <a href="inicio.php?op=rol_ingresar" class="w3-bar-item w3-button">Ingresar</a>
    <?php endif; ?>

    <?php if (in_array('rol_listar', $permisos)): ?>
      <a href="inicio.php?op=rol_listar" class="w3-bar-item w3-button">Listar</a>
    <?php endif; ?>

    <?php if (in_array('rol_editar', $permisos)): ?>
      <a href="inicio.php?op=rol_editar_buscar" class="w3-bar-item w3-button">Actualizar</a>
    <?php endif; ?>

    <?php if (in_array('rol_eliminar', $permisos)): ?>
      <a href="inicio.php?op=rol_eliminar" class="w3-bar-item w3-button">Eliminar</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>

<!-- ================= MENÚ SEGURIDAD ================= -->
<?php
$menuSeguridad = [
    'permisos_editar',
	'usuario_normal'
];
if (count(array_intersect($menuSeguridad, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    SEGURIDAD <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('permisos_editar', $permisos)): ?>
      <a href="inicio.php?op=permisos_editar_buscar" class="w3-bar-item w3-button">Editar</a>
    <?php endif; ?>
	  
	<?php if (in_array('usuario_normal', $permisos)): ?>
      <a href="inicio.php?op=cambiar_perfil" class="w3-bar-item w3-button">Editar Perfil</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>

<!-- ================= MENÚ AUDITORIA ================= -->
<?php
$menuAuditoria = [
    'auditoria_ver'
];
if (count(array_intersect($menuAuditoria, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    AUDITORIA <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('auditoria_ver', $permisos)): ?>
      <a href="inicio.php?op=auditoria_ver" class="w3-bar-item w3-button">Ver</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>
	  
<!-- ================= MENÚ ALUMNO ================= -->
<?php
$menuSeguridad = [
    'alumno_ingresar',
    'alumno_listar',
    'alumno_editar',
    'alumno_eliminar',
	'alumno_notas'
];
if (count(array_intersect($menuSeguridad, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    ALUMNO <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('alumno_ingresar', $permisos)): ?>
      <a href="inicio.php?op=alumno_ingresar" class="w3-bar-item w3-button">Ingresar</a>
    <?php endif; ?>
	  
	<?php if (in_array('alumno_listar', $permisos)): ?>
      <a href="inicio.php?op=alumno_listar" class="w3-bar-item w3-button">Listar</a>
    <?php endif; ?>
	
	<?php if (in_array('alumno_desaprobados', $permisos)): ?>
      <a href="inicio.php?op=alumno_desaprobados" class="w3-bar-item w3-button">Nota recuperación</a>
    <?php endif; ?>
	
	<?php if (in_array('alumno_notas', $permisos)): ?>
      <a href="inicio.php?op=alumno_notas" class="w3-bar-item w3-button">Modificar Notas</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>

<!-- ================= MENÚ ALUMNO ================= -->
<?php
$menuSeguridad = [
    'curso_ingresar',
    'curso_listar',
    'curso_editar',
    'curso_eliminar'
];
if (count(array_intersect($menuSeguridad, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    CURSOS <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('curso_ingresar', $permisos)): ?>
      <a href="inicio.php?op=curso_ingresar" class="w3-bar-item w3-button">Ingresar</a>
    <?php endif; ?>
	  
	<?php if (in_array('curso_listar', $permisos)): ?>
      <a href="inicio.php?op=curso_listar" class="w3-bar-item w3-button">Listar</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>

<!-- ================= MENÚ REPORTES ================= -->
<?php
$menuSeguridad = [
    'generar_reportes'
];
if (count(array_intersect($menuSeguridad, $permisos)) > 0):
?>
<div class="w3-dropdown-hover w3-hide-small">
  <button class="w3-padding-large w3-button">
    REPORTE <i class="fa fa-caret-down"></i>
  </button>
  <div class="w3-dropdown-content w3-bar-block w3-card-4">

    <?php if (in_array('generar_reportes', $permisos)): ?>
      <a href="inicio.php?op=generar_reportes" class="w3-bar-item w3-button">Generar reporte</a>
    <?php endif; ?>

  </div>
</div>
<?php endif; ?>
	  
<!-- ================= INICIO ================= -->
<a href="inicio.php" class="w3-bar-item w3-button w3-padding-large w3-hide-small">
  INICIO
</a>

<!-- ================= USUARIO ================= -->
<div class="w3-bar-item w3-right w3-padding-large">
  👤 <?= $_SESSION['usuario'] ?> |
  <span id="reloj"></span> |
  <a href="../server/logout.php" class="w3-text-red">Salir</a>
</div>

  </div>
</div>

<!-- ================= CONTENIDO ================= -->
<div class="w3-content" style="max-width:1200px; margin-top:80px">

<?php if (!isset($_GET['op'])): ?>
<div class="w3-container w3-center w3-margin-bottom">
  <h2 class="w3-text-blue">Sistema de Gestión</h2>
  <p class="w3-text-grey">Panel principal</p>
  <hr>
</div>
<?php endif; ?>
	
<!-- GIF SOLO PARA INICIO -->
<?php if (!isset($_GET['op'])): ?>
<div align="center" id="gif-inicio" class="gif-inicio">
    <img width="40%" src="../img/bienvenido.gif" alt="Bienvenido">
</div>
<?php endif; ?>

<?php
$op = $_GET['op'] ?? 'dashboard';

switch ($op) {

    case 'usuario_ingresar':
        include 'modulos/usuario_ingresar.php';
        break;

    case 'usuario_listar':
        include 'modulos/usuario_listar.php';
        break;
		
	case 'usuario_editar':
        include 'modulos/usuario_editar.php';
        break;	
		
    case 'usuario_editar_buscar':
        include 'modulos/usuario_editar_buscar.php';
        break;

    case 'usuario_eliminar':
        include 'modulos/usuario_eliminar.php';
        break;

    case 'rol_ingresar':
        include 'modulos/rol_ingresar.php';
        break;

    case 'rol_listar':
        include 'modulos/rol_listar.php';
        break;

    case 'rol_editar':
        include 'modulos/rol_editar.php';
        break;
		
	 case 'rol_editar_buscar':
        include 'modulos/rol_editar_buscar.php';
        break;
		
    case 'rol_eliminar':
        include 'modulos/rol_eliminar.php';
        break;
		
	case 'permisos_editar':
        include 'modulos/permisos_editar.php';
        break;

    case 'permisos_editar_buscar':
        include 'modulos/permisos_editar_buscar.php';
        break;
	
	case 'auditoria_ver':
        include 'modulos/auditoria_ver.php';
        break;
	
	case 'alumno_ingresar':
        include 'modulos/alumno_ingresar.php';
        break;

    case 'alumno_listar':
        include 'modulos/alumno_listar.php';
        break;
		
	case 'alumno_desaprobados':
        include 'modulos/alumno_desaprobados.php';
        break;	
		
    case 'alumno_recuperacion':
        include 'modulos/alumno_recuperacion.php';
        break;
		
	case 'alumno_editar':
        include 'modulos/alumno_editar.php';
        break;
		
	case 'alumno_notas':
        include 'modulos/alumno_notas.php';
        break;
		
	case 'reporte_menu':
        include 'modulos/reporte_menu.php';
        break;
	
	case 'reporte_curso':
		include 'modulos/reportes/reporte_curso.php';
		break;

	case 'reporte_curso_estado':
		include 'modulos/reportes/reporte_curso_estado.php';
		break;

	case 'reporte_desaprobados':
		include 'modulos/reportes/reporte_desaprobados.php';
    break;

    case 'alumno_eliminar':
        include 'modulos/usuario_eliminar.php';
        break;
	
	case 'curso_ingresar':
        include 'modulos/curso_ingresar.php';
        break;

    case 'curso_listar':
        include 'modulos/curso_listar.php';
        break;
		
	case 'curso_editar':
        include 'modulos/curso_editar.php';
        break;

	case 'generar_reportes':
		include 'modulos/generar_reportes.php';
		break;
		
	case 'cambiar_perfil':
		include 'modulos/cambiar_perfil.php';
		break;
		
    default:
        include 'modulos/dashboard.php';
}
?>

</div>
<script>
document.addEventListener("DOMContentLoaded", function () {

    const gif = document.getElementById("gif-inicio");
    if (!gif) return;

    // Detectar clic en cualquier link del menú
    const linksMenu = document.querySelectorAll(".w3-bar a");

    linksMenu.forEach(link => {
        link.addEventListener("click", () => {
            gif.style.display = "none";
        });
    });

});
</script>

</body>
</html>
