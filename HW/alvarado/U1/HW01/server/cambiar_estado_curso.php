<?php
session_start();
include_once "conexion.php";

/* ================= SEGURIDAD ================= */

if (!isset($_SESSION['usuario']) || 
    !in_array('curso_eliminar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_POST['id_curso']) || !isset($_POST['Estado_curso'])) {
    die("Datos incompletos");
}

/* ================= DATOS ================= */

$id_curso = intval($_POST['id_curso']);
$nuevo_estado = $_POST['Estado_curso'];

/* Validar estado permitido */
if (!in_array($nuevo_estado, ['Activo', 'Inactivo'])) {
    die("Estado inválido");
}

/* ================= VERIFICAR EXISTENCIA ================= */

$sqlExiste = "SELECT Nombre_curso FROM curso WHERE id_curso = ?";
$stmtExiste = $conn->prepare($sqlExiste);
$stmtExiste->bind_param("i", $id_curso);
$stmtExiste->execute();
$resultExiste = $stmtExiste->get_result();

if ($resultExiste->num_rows === 0) {
    die("Curso no encontrado");
}

$curso = $resultExiste->fetch_assoc();
$Nombre_curso = $curso['Nombre_curso'];

$stmtExiste->close();

/* ================= ACTUALIZAR ESTADO ================= */

$sqlUpdate = "
UPDATE curso 
SET Estado_curso = ?
WHERE id_curso = ?
";

$stmtUpdate = $conn->prepare($sqlUpdate);

if (!$stmtUpdate) {
    die("Error en la consulta");
}

$stmtUpdate->bind_param("si", $nuevo_estado, $id_curso);
$stmtUpdate->execute();
$stmtUpdate->close();

/* ================= AUDITORÍA ================= */

include_once "auditoria.php";

$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor cambió el estado del curso '$Nombre_curso' a $nuevo_estado"
);

/* ================= FIN ================= */

$conn->close();

header("Location: ../paginas/inicio.php?op=curso_listar&estado=modificado");
exit;
?>
