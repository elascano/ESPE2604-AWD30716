<?php
session_start();
include_once "../server/conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('generar_reportes', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== CURSOS ACTIVOS (para filtros) ===== */
$sqlCursos = "SELECT id_curso, Nombre_curso 
              FROM curso 
              WHERE Estado_curso = 'Activo'
              ORDER BY Nombre_curso";

$resultCursos = $conn->query($sqlCursos);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Generar Reportes</title>
<link rel="stylesheet" href="../estilos/estilos.css">

<script>
function mostrarFiltros() {
    let tipo = document.getElementById("tipo_reporte").value;

    document.getElementById("filtros_auditoria").style.display = "none";
    document.getElementById("filtros_notas").style.display = "none";

    if (tipo === "auditoria") {
        document.getElementById("filtros_auditoria").style.display = "block";
    }

    if (tipo === "notas") {
        document.getElementById("filtros_notas").style.display = "block";
    }
}
</script>

</head>
<body>

<h2 align="center">GENERAR REPORTES</h2>

<form method="post" action="../server/generar_pdf.php">

<p>
<label>Tipo de Reporte:</label>
<select name="tipo_reporte" id="tipo_reporte" onchange="mostrarFiltros()" required>
    <option value="">Seleccione</option>
    <option value="auditoria">Auditoría</option>
    <option value="notas">Notas</option>
</select>
</p>

<!-- ================= AUDITORIA ================= -->
<div id="filtros_auditoria" style="display:none; border:1px solid #ccc; padding:15px; margin-top:10px;">

<h3>Filtros Auditoría</h3>

<p>
<label>Fecha desde:</label>
<input type="date" name="fecha_desde">
</p>

<p>
<label>Fecha hasta:</label>
<input type="date" name="fecha_hasta">
</p>

<p>
<label>Buscar palabra clave:</label>
<input type="text" name="palabra_clave">
</p>

</div>

<!-- ================= NOTAS ================= -->
<div id="filtros_notas" style="display:none; border:1px solid #ccc; padding:15px; margin-top:10px;">

<h3>Filtros Notas</h3>

<p>
<label>Curso:</label>
<select name="id_curso">
    <option value="">Todos</option>
    <?php while ($curso = $resultCursos->fetch_assoc()): ?>
        <option value="<?= $curso['id_curso'] ?>">
            <?= htmlspecialchars($curso['Nombre_curso']) ?>
        </option>
    <?php endwhile; ?>
</select>
</p>

<p>
<label>Estado Académico:</label>
<select name="estado_academico">
    <option value="">Todos</option>
    <option value="Aprobado">Aprobado</option>
    <option value="Desaprobado">Desaprobado</option>
</select>
</p>

<p>
<label>Estado en Sistema:</label>
<select name="estado_sistema">
    <option value="">Todos</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
</select>
</p>

<p>
<label>Promedio mínimo:</label>
<input type="number" step="0.01" name="promedio_min">
</p>

<p>
<label>Promedio máximo:</label>
<input type="number" step="0.01" name="promedio_max">
</p>

</div>

<br>

<p align="center">
<input type="submit" value="Generar PDF">
<a href="inicio.php">Cancelar</a>
</p>

</form>

</body>
</html>
