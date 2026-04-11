<?php
session_start();
include_once "conexion.php";

/* ================= SEGURIDAD ================= */

if (!isset($_SESSION['usuario']) || 
    !in_array('curso_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_POST['id_curso'])) {
    die("Curso no especificado");
}

/* ================= DATOS ================= */

$id_curso          = intval($_POST['id_curso']);
$Nombre_curso      = trim($_POST['Nombre_curso'] ?? '');
$Descripcion_curso = trim($_POST['Descripcion_curso'] ?? '');

/* ================= VALIDACIONES ================= */

if (empty($Nombre_curso)) {
    die("El nombre del curso es obligatorio");
}

/* ================= VERIFICAR EXISTENCIA ================= */

$sqlExiste = "SELECT id_curso FROM curso WHERE id_curso = ?";
$stmtExiste = $conn->prepare($sqlExiste);
$stmtExiste->bind_param("i", $id_curso);
$stmtExiste->execute();
$resultExiste = $stmtExiste->get_result();

if ($resultExiste->num_rows === 0) {
    die("Curso no encontrado");
}
$stmtExiste->close();

/* ================= VALIDAR DUPLICADO ================= */
/* Excluir el mismo curso */

$sqlDuplicado = "
SELECT id_curso 
FROM curso 
WHERE Nombre_curso = ? 
AND id_curso != ?
";

$stmtDuplicado = $conn->prepare($sqlDuplicado);
$stmtDuplicado->bind_param("si", $Nombre_curso, $id_curso);
$stmtDuplicado->execute();
$stmtDuplicado->store_result();

if ($stmtDuplicado->num_rows > 0) {
    $stmtDuplicado->close();
    $conn->close();
    die("Ya existe otro curso con ese nombre");
}
$stmtDuplicado->close();

/* ================= ACTUALIZAR ================= */

$sqlUpdate = "
UPDATE curso 
SET Nombre_curso = ?, 
    Descripcion_curso = ?
WHERE id_curso = ?
";

$stmtUpdate = $conn->prepare($sqlUpdate);

if (!$stmtUpdate) {
    die("Error en la consulta");
}

$stmtUpdate->bind_param("ssi",
    $Nombre_curso,
    $Descripcion_curso,
    $id_curso
);

$stmtUpdate->execute();
$stmtUpdate->close();

/* ================= AUDITORÍA ================= */

include_once "auditoria.php";

$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor actualizó el curso ID $id_curso ($Nombre_curso)"
);

/* ================= FIN ================= */

$conn->close();

header("Location: ../paginas/inicio.php?op=curso_listar&estado=actualizado");
exit;
?>
