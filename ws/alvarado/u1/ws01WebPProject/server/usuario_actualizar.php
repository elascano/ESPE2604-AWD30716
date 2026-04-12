<?php
session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('usuario_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS ===== */
$id_usuario        = intval($_POST['id_usuario']);
$Nombres_user      = trim($_POST['Nombres_user']);
$Apellidos_user    = trim($_POST['Apellidos_user']);
$Usuario_user      = trim($_POST['Usuario_user']);
$Cedula_user       = trim($_POST['Cedula_user']);
$Fecha_nacimiento  = $_POST['Fecha_nacimiento'];
$id_rol            = $_POST['id_rol'] ?? null;
$Clave_user        = $_POST['Clave_user'];

/* ===== VALIDACIÓN: NO EDITARSE A SÍ MISMO ===== */
if ($id_usuario == $_SESSION['id_usuario']) {
    die("No puede editar su propio usuario");
}

/* ==========================================================
   VALIDAR USUARIO NO REPETIDO
========================================================== */
$checkUser = $conn->prepare(
    "SELECT id_usuario FROM usuarios 
     WHERE Usuario_user = ? AND id_usuario != ?"
);
$checkUser->bind_param("si", $Usuario_user, $id_usuario);
$checkUser->execute();
$checkUser->store_result();

if ($checkUser->num_rows > 0) {
    die("El nombre de usuario ya está en uso");
}
$checkUser->close();

/* ==========================================================
   VALIDAR CÉDULA NO REPETIDA
========================================================== */
$checkCedula = $conn->prepare(
    "SELECT id_usuario FROM usuarios 
     WHERE Cedula_user = ? AND id_usuario != ?"
);
$checkCedula->bind_param("si", $Cedula_user, $id_usuario);
$checkCedula->execute();
$checkCedula->store_result();

if ($checkCedula->num_rows > 0) {
    die("La cédula ya está registrada");
}
$checkCedula->close();

/* ===== CALCULAR EDAD ===== */
$fechaNac = new DateTime($Fecha_nacimiento);
$hoy = new DateTime();
$edad = $hoy->diff($fechaNac)->y;

/* ===== VALIDAR FECHA ===== */
if ($Fecha_nacimiento > date('Y-m-d') || $edad < 5 || $edad > 120) {
    die("Fecha de nacimiento no válida");
}

/* ==========================================================
   ACTUALIZAR USUARIO
========================================================== */
if (!empty($Clave_user)) {

    $clave_hash = password_hash($Clave_user, PASSWORD_DEFAULT);

    $sql = "UPDATE usuarios SET
                Nombres_user=?,
                Apellidos_user=?,
                Usuario_user=?,
                Cedula_user=?,
                Fecha_nacimiento=?,
                Edad_user=?,
                Clave_user=?
            WHERE id_usuario=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "sssssssi",
        $Nombres_user,
        $Apellidos_user,
        $Usuario_user,
        $Cedula_user,
        $Fecha_nacimiento,
        $edad,
        $clave_hash,
        $id_usuario
    );

} else {

    $sql = "UPDATE usuarios SET
                Nombres_user=?,
                Apellidos_user=?,
                Usuario_user=?,
                Cedula_user=?,
                Fecha_nacimiento=?,
                Edad_user=?
            WHERE id_usuario=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssi",
        $Nombres_user,
        $Apellidos_user,
        $Usuario_user,
        $Cedula_user,
        $Fecha_nacimiento,
        $edad,
        $id_usuario
    );
}

$stmt->execute();
$stmt->close();

/* ==========================================================
   ACTUALIZAR ROL
========================================================== */
if (!empty($id_rol)) {

    $check = $conn->prepare(
        "SELECT 1 FROM usuarios_rol WHERE id_usuario=?"
    );
    $check->bind_param("i", $id_usuario);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $sqlRol = "UPDATE usuarios_rol SET id_rol=? WHERE id_usuario=?";
        $stmtRol = $conn->prepare($sqlRol);
        $stmtRol->bind_param("ii", $id_rol, $id_usuario);
    } else {
        $sqlRol = "INSERT INTO usuarios_rol (id_usuario, id_rol) VALUES (?, ?)";
        $stmtRol = $conn->prepare($sqlRol);
        $stmtRol->bind_param("ii", $id_usuario, $id_rol);
    }

    $stmtRol->execute();
    $stmtRol->close();

} else {
    $stmtRol = $conn->prepare(
        "DELETE FROM usuarios_rol WHERE id_usuario=?"
    );
    $stmtRol->bind_param("i", $id_usuario);
    $stmtRol->execute();
    $stmtRol->close();
}

/* ==========================================================
   AUDITORÍA
========================================================== */
include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
registrarAuditoria(
    $conn,
    "$actor editó el usuario: $Usuario_user"
);

$conn->close();

header("Location: ../paginas/inicio.php?op=usuario_listar");
exit;
