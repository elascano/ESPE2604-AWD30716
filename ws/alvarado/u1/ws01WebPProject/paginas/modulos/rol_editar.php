<?php
session_start();
include_once "../server/conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('rol_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== ID ROL ===== */
if (!isset($_POST['id_rol'])) {
    header("Location: inicio.php?op=rol_listar");
    exit;
}

$id_rol = intval($_POST['id_rol']);

/* ===== DATOS DEL ROL ===== */
$sql = "SELECT id_rol, Nombre_rol, Descripcion_rol
        FROM rol
        WHERE id_rol = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rol);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    die("Rol no encontrado");
}

$rol = $result->fetch_assoc();

/* ===== BLOQUEAR ADMINISTRADOR ===== */
if ($rol['Nombre_rol'] === 'Administrador') {
    die("No está permitido editar el rol Administrador");
}

/* ===== BLOQUEAR EDICIÓN DEL ROL PROPIO ===== */
$id_usuario = $_SESSION['id_usuario'];

$sqlUserRol = "SELECT 1
               FROM usuarios_rol
               WHERE id_usuario = ? AND id_rol = ?";
$stmtUserRol = $conn->prepare($sqlUserRol);
$stmtUserRol->bind_param("ii", $id_usuario, $id_rol);
$stmtUserRol->execute();
$stmtUserRol->store_result();

if ($stmtUserRol->num_rows > 0) {
    die("No puede editar el rol que usted mismo tiene asignado");
}

$stmtUserRol->close();
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Editar Rol</title>
<link rel="stylesheet" href="../estilos/estilos.css">
</head>

<body>

<h2 align="center">EDITAR ROL</h2>

<form method="post" action="../server/rol_actualizar.php">

<input type="hidden" name="id_rol" value="<?= $rol['id_rol'] ?>">

<fieldset>
<legend>Datos del Rol</legend>

<p>
<label>Nombre del Rol:</label>
<input type="text" name="Nombre_rol" required
value="<?= htmlspecialchars($rol['Nombre_rol']) ?>">
</p>

<p>
<label>Descripción del Rol:</label>
<textarea name="Descripcion_rol" rows="4" required><?= htmlspecialchars($rol['Descripcion_rol']) ?></textarea>
</p>

</fieldset>

<p align="center">
<input type="submit" value="Actualizar Rol">
<a href="inicio.php?op=rol_editar_buscar">Cancelar</a>
</p>

</form>

</body>
</html>
