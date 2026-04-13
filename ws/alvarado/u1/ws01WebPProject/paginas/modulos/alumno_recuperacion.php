<?php 
session_start();
include_once "../server/conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('alumno_recuperacion', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== VALIDAR ID ===== */
if (!isset($_POST['id_alumno'])) {
    die("Alumno no especificado");
}

$id_alumno = intval($_POST['id_alumno']);

/* ===== OBTENER DATOS DEL ALUMNO ===== */
$sql = "
SELECT 
    a.id_alumno,
    a.Nombre_alumno,
    c.Nombre_curso,
    a.Nota_1,
    a.Nota_2,
    a.Nota_3,
    a.Nota_recuperacion
FROM alumno a
LEFT JOIN curso c ON a.id_curso = c.id_curso
WHERE a.id_alumno = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_alumno);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Alumno no encontrado");
}

$alumno = $result->fetch_assoc();
$stmt->close();
?>

<div class="w3-container w3-card w3-padding w3-margin-top">

<h3 class="w3-text-red">Registro de Nota de Recuperación</h3>

<form method="post" action="../server/alumno_actualizar_recuperacion.php">

<input type="hidden" name="id_alumno" 
       value="<?= htmlspecialchars($alumno['id_alumno']) ?>">

<fieldset class="w3-margin-bottom">
<legend><strong>Datos del Alumno</strong></legend>

<p>
<label>Nombre:</label>
<input type="text" class="w3-input" disabled
       value="<?= htmlspecialchars($alumno['Nombre_alumno']) ?>">
</p>

<p>
<label>Curso:</label>
<input type="text" class="w3-input" disabled
       value="<?= htmlspecialchars($alumno['Nombre_curso'] ?? 'Sin curso') ?>">
</p>

<p>
<label>Nota 1:</label>
<input type="number" class="w3-input" disabled
       value="<?= htmlspecialchars($alumno['Nota_1']) ?>">
</p>

<p>
<label>Nota 2:</label>
<input type="number" class="w3-input" disabled
       value="<?= htmlspecialchars($alumno['Nota_2']) ?>">
</p>

<p>
<label>Nota 3:</label>
<input type="number" class="w3-input" disabled
       value="<?= htmlspecialchars($alumno['Nota_3']) ?>">
</p>

</fieldset>

<fieldset class="w3-margin-bottom">
<legend><strong>Nota de Recuperación</strong></legend>

<p>
<label>Nota (0 a 20):</label>
<input type="number"
       name="Nota_recuperacion"
       class="w3-input"
       min="0"
       max="20"
       step="0.01"
       required
       value="<?= htmlspecialchars($alumno['Nota_recuperacion'] ?? '') ?>">
</p>

<p class="w3-text-grey w3-small">
* Puede volver a registrar la nota si el alumno sigue desaprobado.
</p>

</fieldset>

<button type="submit" class="w3-button w3-green">
    Guardar Recuperación
</button>

<a href="inicio.php?op=alumno_desaprobados" 
   class="w3-button w3-gray">
   Cancelar
</a>

</form>
</div>
