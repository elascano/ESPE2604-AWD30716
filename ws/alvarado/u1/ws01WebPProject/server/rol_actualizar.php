<?php
session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('rol_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS ===== */
if (!isset($_POST['id_rol'], $_POST['Nombre_rol'], $_POST['Descripcion_rol'])) {
    die("Datos incompletos");
}

$id_rol          = intval($_POST['id_rol']);
$Nombre_rol      = trim($_POST['Nombre_rol']);
$Descripcion_rol = trim($_POST['Descripcion_rol']);

/* ===== VERIFICAR SI ES ADMINISTRADOR ===== */
$sqlCheck = "SELECT Nombre_rol FROM rol WHERE id_rol = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $id_rol);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows === 0) {
    die("Rol no encontrado");
}

$rol = $result->fetch_assoc();

if ($rol['Nombre_rol'] === 'Administrador') {
    die("No está permitido modificar el rol Administrador");
}

/* ===== ACTUALIZAR ROL ===== */
$sql = "UPDATE rol 
        SET Nombre_rol = ?, Descripcion_rol = ?
        WHERE id_rol = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $Nombre_rol, $Descripcion_rol, $id_rol);
$stmt->execute();


include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
registrarAuditoria(
    $conn,
    "$actor modificó el rol: $Nombre_rol"
);


/* ===== FIN ===== */
$stmt->close();
$stmtCheck->close();
$conn->close();

header("Location: ../paginas/inicio.php?op=rol_editar_buscar");
exit;
