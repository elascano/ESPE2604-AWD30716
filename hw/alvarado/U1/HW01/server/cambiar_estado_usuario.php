<?php
session_start();

/* ================= SEGURIDAD ================= */

// Verificar sesión activa
if (!isset($_SESSION['usuario'])) {
    die("Acceso no autorizado");
}

// Verificar permiso específico
if (!isset($_SESSION['permisos']) || !in_array('usuario_eliminar', $_SESSION['permisos'])) {
    die("No tiene permisos para cambiar el estado del usuario");
}

/* ================= CONEXIÓN ================= */
include_once "conexion.php";

/* ================= VALIDACIÓN DE DATOS ================= */
$id_usuario = intval($_POST['id_usuario'] ?? 0);
$Estado_user = $_POST['Estado_user'] ?? '';

if ($id_usuario <= 0 || !in_array($Estado_user, ['Activo', 'Inactivo'])) {
    die("Datos inválidos");
}

/* ================= PROTECCIÓN EXTRA ================= */
// Evitar que el usuario se desactive a sí mismo
if ($id_usuario == $_SESSION['id_usuario']) {
    die("No puede cambiar su propio estado");
}

/* ================= ACTUALIZACIÓN ================= */
$sql = "UPDATE usuarios SET Estado_user = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la consulta");
}

$stmt->bind_param("si", $Estado_user, $id_usuario);


include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
$accion = ($Estado_user === 'Inactivo') ? 'desactivó' : 'activó';

registrarAuditoria(
    $conn,
    "$actor $accion el usuario con ID $id_usuario"
);


if ($stmt->execute()) {
    $stmt->close();
    $conn->close();

    header("Location: ../paginas/inicio.php?op=usuario_eliminar&estado=ok");
    exit;
} else {
    die("Error al cambiar el estado del usuario");
}
?>