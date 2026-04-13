<?php
session_start();

/* ================= SEGURIDAD ================= */

// Verificar sesión activa
if (!isset($_SESSION['usuario'], $_SESSION['id_usuario'])) {
    die("Acceso no autorizado");
}

// Verificar permiso específico
if (!isset($_SESSION['permisos']) || !in_array('rol_eliminar', $_SESSION['permisos'])) {
    die("No tiene permisos para cambiar el estado del rol");
}

/* ================= CONEXIÓN ================= */
include_once "conexion.php";

/* ================= VALIDACIÓN DE DATOS ================= */
$id_rol     = intval($_POST['id_rol'] ?? 0);
$Estado_rol = $_POST['Estado_rol'] ?? '';

if ($id_rol <= 0 || !in_array($Estado_rol, ['Activo', 'Inactivo'])) {
    die("Datos inválidos");
}

/* ================= PROTECCIÓN ADMINISTRADOR ================= */
$sqlCheck = "SELECT Nombre_rol FROM rol WHERE id_rol = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $id_rol);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows === 0) {
    die("Rol no encontrado");
}

$rol = $resultCheck->fetch_assoc();

if ($rol['Nombre_rol'] === 'Administrador') {
    die("No se puede modificar el rol Administrador");
}

$stmtCheck->close();

/* ================= BLOQUEAR DESACTIVACIÓN DEL ROL PROPIO ================= */
$id_usuario = $_SESSION['id_usuario'];

$sqlUserRol = "SELECT 1
               FROM usuarios_rol
               WHERE id_usuario = ? AND id_rol = ?";
$stmtUserRol = $conn->prepare($sqlUserRol);
$stmtUserRol->bind_param("ii", $id_usuario, $id_rol);
$stmtUserRol->execute();
$stmtUserRol->store_result();

if ($stmtUserRol->num_rows > 0) {
    die("No puede desactivar ni modificar un rol que usted tiene asignado");
}

$stmtUserRol->close();

/* ================= ACTUALIZACIÓN ================= */
$sql = "UPDATE rol SET Estado_rol = ? WHERE id_rol = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la consulta");
}

$stmt->bind_param("si", $Estado_rol, $id_rol);

/* ================= AUDITORÍA ================= */
include_once 'auditoria.php';

$actor  = $_SESSION['usuario'];
$accion = ($Estado_rol === 'Inactivo') ? 'desactivó' : 'activó';

registrarAuditoria(
    $conn,
    "$actor $accion el rol {$rol['Nombre_rol']}"
);

/* ================= EJECUCIÓN ================= */
if ($stmt->execute()) {
    $stmt->close();
    $conn->close();

    header("Location: ../paginas/inicio.php?op=rol_eliminar&estado=ok");
    exit;
} else {
    die("Error al cambiar el estado del rol");
}
?>