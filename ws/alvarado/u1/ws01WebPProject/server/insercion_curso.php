<?php
session_start();
include_once "conexion.php";

/* ================= SEGURIDAD ================= */

if (!isset($_SESSION['usuario'])) {
    die("Acceso no autorizado");
}

if (!isset($_SESSION['permisos']) || 
    !in_array('curso_ingresar', $_SESSION['permisos'])) {
    die("No tiene permisos para ingresar cursos");
}

/* ================= DATOS ================= */

$Nombre_curso       = trim($_POST['Nombre_curso'] ?? '');
$Descripcion_curso  = trim($_POST['Descripcion_curso'] ?? '');
$Estado_curso       = $_POST['Estado_curso'] ?? '';

/* ================= VALIDACIONES ================= */

if (empty($Nombre_curso) || empty($Estado_curso)) {
    die("Debe completar los campos obligatorios");
}

if (!in_array($Estado_curso, ['Activo', 'Inactivo'])) {
    die("Estado inválido");
}

/* ================= VALIDAR DUPLICADO ================= */

$sqlCheck = "SELECT id_curso FROM curso WHERE Nombre_curso = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("s", $Nombre_curso);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    $stmtCheck->close();
    $conn->close();
    die("Ya existe un curso con ese nombre");
}

$stmtCheck->close();

/* ================= INSERTAR ================= */

$sql = "INSERT INTO curso 
        (Nombre_curso, Descripcion_curso, Estado_curso)
        VALUES (?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la consulta");
}

$stmt->bind_param("sss",
    $Nombre_curso,
    $Descripcion_curso,
    $Estado_curso
);

$stmt->execute();
$stmt->close();

/* ================= AUDITORÍA ================= */

include_once 'auditoria.php';

$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor registró el curso: $Nombre_curso"
);

/* ================= FIN ================= */

$conn->close();

header("Location: ../paginas/inicio.php?op=curso_listar&estado=ok");
exit;
?>
