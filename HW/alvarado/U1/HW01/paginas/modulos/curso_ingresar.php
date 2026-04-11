<?php
session_start();

/* ================= SEGURIDAD ================= */

if (!isset($_SESSION['usuario'])) {
    die("Acceso no autorizado");
}

if (!isset($_SESSION['permisos']) || 
    !in_array('curso_ingresar', $_SESSION['permisos'])) {
    die("No tiene permisos para ingresar cursos");
}
?>

<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ingresar Curso</title>
<link rel="stylesheet" href="../estilos/estilos.css">
</head>

<body>

<h2 align="center">INGRESAR CURSO</h2>

<form method="post" action="../server/insercion_curso.php">

<fieldset>
<legend>Datos del Curso</legend>

<p>
<label>Nombre del Curso:</label>
<input type="text" name="Nombre_curso" required>
</p>

<p>
<label>Descripción:</label>
<textarea name="Descripcion_curso" rows="4"></textarea>
</p>

<p>
<label>Estado:</label>
<select name="Estado_curso" required>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
</select>
</p>

</fieldset>

<p align="center">
<input type="submit" value="Guardar">
<a href="inicio.php?op=curso_listar">Cancelar</a>
</p>

</form>

</body>
</html>
