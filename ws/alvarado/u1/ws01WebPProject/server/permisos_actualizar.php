<?php
session_start();
include_once "conexion.php";

/* ========= SEGURIDAD ========= */
if (!in_array('permisos_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ========= VALIDAR DATOS ========= */
if (!isset($_POST['id_rol'])) {
    die("Rol no recibido");
}

$id_rol   = intval($_POST['id_rol']);
$permisos = $_POST['permisos'] ?? [];

/* ========= VERIFICAR ROL ========= */
$sqlRol = "SELECT Nombre_rol
           FROM rol
           WHERE id_rol = ?";

$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("i", $id_rol);
$stmtRol->execute();
$resultRol = $stmtRol->get_result();

if ($resultRol->num_rows === 0) {
    die("Rol no encontrado");
}

$rol = $resultRol->fetch_assoc();

/* ========= BLOQUEAR ADMIN ========= */
if ($rol['Nombre_rol'] === 'Administrador') {
    die("No está permitido modificar permisos del Administrador");
}

/* ========= ELIMINAR PERMISOS ACTUALES ========= */
$sqlDelete = "DELETE FROM permisos WHERE id_rol = ?";
$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("i", $id_rol);
$stmtDelete->execute();

/* ========= INSERTAR NUEVOS PERMISOS ========= */
if (!empty($permisos)) {

    $sqlInsert = "INSERT INTO permisos (id_rol, id_opcion)
                  VALUES (?, ?)";

    $stmtInsert = $conn->prepare($sqlInsert);

    foreach ($permisos as $id_opcion) {
        $id_opcion = intval($id_opcion);
        $stmtInsert->bind_param("ii", $id_rol, $id_opcion);
        $stmtInsert->execute();
    }

    $stmtInsert->close();
}


include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
$rolNombre = $rol['Nombre_rol'];

registrarAuditoria(
    $conn,
    "$actor cambió permisos del rol $rolNombre"
);


/* ========= CIERRE ========= */
$stmtRol->close();
$stmtDelete->close();
$conn->close();

/* ========= REDIRECCIÓN ========= */
header("Location: ../paginas/inicio.php?op=permisos_editar_buscar");
exit;
