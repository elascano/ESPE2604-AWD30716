<?php
session_start();

/* ================= SEGURIDAD ================= */

// Verificar sesión activa
if (!isset($_SESSION['usuario'])) {
    die("Acceso no autorizado");
}

// Verificar permiso específico
if (!isset($_SESSION['permisos']) || 
    !in_array('usuario_eliminar_alumno', $_SESSION['permisos'])) {
    die("No tiene permisos para cambiar el estado del alumno");
}

/* ================= CONEXIÓN ================= */
include_once "conexion.php";

/* ================= VALIDACIÓN DE DATOS ================= */
$id_alumno = intval($_POST['id_alumno'] ?? 0);
$Estado_alumno_AI = $_POST['Estado_alumno_AI'] ?? '';

if ($id_alumno <= 0 || !in_array($Estado_alumno_AI, ['Activo', 'Inactivo'])) {
    die("Datos inválidos");
}

/* ================= ACTUALIZACIÓN ================= */
$sql = "UPDATE alumno SET Estado_alumno_AI = ? WHERE id_alumno = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la consulta");
}

$stmt->bind_param("si", $Estado_alumno_AI, $id_alumno);

/* ================= AUDITORÍA ================= */
include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
$accion = ($Estado_alumno_AI === 'Inactivo') ? 'desactivó' : 'activó';

registrarAuditoria(
    $conn,
    "$actor $accion el alumno con ID $id_alumno"
);

/* ================= EJECUCIÓN ================= */
if ($stmt->execute()) {

    $stmt->close();
    $conn->close();

    header("Location: ../paginas/inicio.php?op=alumno_listar&estado=ok");
    exit;

} else {
    die("Error al cambiar el estado del alumno");
}
?>
