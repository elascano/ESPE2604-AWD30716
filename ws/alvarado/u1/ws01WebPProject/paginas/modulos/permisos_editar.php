<<?php
session_start();
include_once "../server/conexion.php";

/* ========= SEGURIDAD ========= */
if (!in_array('permisos_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ========= VALIDAR ID ROL ========= */
if (!isset($_POST['id_rol'])) {
    die("Rol no recibido");
}

$id_rol = intval($_POST['id_rol']);

/* ========= DATOS DEL ROL ========= */
$sqlRol = "SELECT id_rol, Nombre_rol, Descripcion_rol
           FROM rol
           WHERE id_rol = ?";

$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("i", $id_rol);
$stmtRol->execute();
$resultRol = $stmtRol->get_result();

if ($resultRol->num_rows === 0) {
    die("Rol no encontrado");
}

$rol = $resultRol->fetch_assoc();

/* ========= BLOQUEAR ADMIN ========= */
if ($rol['Nombre_rol'] === 'Administrador') {
    die("No se pueden modificar permisos del Administrador");
}

/* ========= PERMISOS ACTUALES DEL ROL ========= */
$permisosRol = [];

$sqlPerm = "SELECT id_opcion
            FROM permisos
            WHERE id_rol = ?";

$stmtPerm = $conn->prepare($sqlPerm);
$stmtPerm->bind_param("i", $id_rol);
$stmtPerm->execute();
$resPerm = $stmtPerm->get_result();

while ($p = $resPerm->fetch_assoc()) {
    $permisosRol[] = $p['id_opcion'];
}

/* ========= TODAS LAS OPCIONES ========= */
$sqlOpciones = "SELECT id_opcion, nombre_opcion
                FROM opciones
                ORDER BY menu_opcion, nombre_opcion";

$resultOpciones = $conn->query($sqlOpciones);
?>

<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Editar Permisos</title>
<link rel="stylesheet" href="../estilos/estilos.css">
</head>

<body>

<h2 align="center">EDITAR PERMISOS DEL ROL</h2>

<!-- ===== DATOS SOLO LECTURA ===== -->
<fieldset>
<legend>Datos del Rol</legend>

<p><strong>Rol:</strong> <?= $rol['Nombre_rol'] ?></p>
<p><strong>Descripción:</strong> <?= $rol['Descripcion_rol'] ?></p>

</fieldset>

<br>

<!-- ===== FORMULARIO PERMISOS ===== -->
<form method="post" action="../server/permisos_actualizar.php">

<input type="hidden" name="id_rol" value="<?= $id_rol ?>">

<fieldset>
<legend>Permisos</legend>

<?php while ($op = $resultOpciones->fetch_assoc()): ?>
    <p>
        <label>
            <input type="checkbox"
                   name="permisos[]"
                   value="<?= $op['id_opcion'] ?>"
                   <?= in_array($op['id_opcion'], $permisosRol) ? 'checked' : '' ?>>
            <?= $op['nombre_opcion'] ?>
        </label>
    </p>
<?php endwhile; ?>

</fieldset>

<br>

<p align="center">
    <button type="submit">Guardar Permisos</button>
    <a href="inicio.php?op=permisos_editar_buscar">Cancelar</a>
</p>

</form>

</body>
</html>
