<?php
session_start();
include_once 'conexion.php';

/* ===== SEGURIDAD ===== */
if (!in_array('usuario_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS ===== */
$Nombres_user     = trim($_POST['Nombres_user']);
$Apellidos_user   = trim($_POST['Apellidos_user']);
$Cedula_user      = trim($_POST['Cedula_user']);
$Fecha_nacimiento = $_POST['Fecha_nacimiento'];
$Usuario_user     = trim($_POST['Usuario_user']);
$Clave_user       = password_hash($_POST['Clave_user'], PASSWORD_DEFAULT);
$Estado_user      = $_POST['Estado_user'];
$roles            = $_POST['roles'] ?? [];

/* ===== VALIDAR FECHA Y EDAD ===== */
$fechaNac = new DateTime($Fecha_nacimiento);
$hoy      = new DateTime();

if ($fechaNac > $hoy) {
    die("Fecha de nacimiento inválida");
}

$edad = $hoy->diff($fechaNac)->y;

if ($edad < 0 || $edad > 100) {
    die("Edad no válida");
}

/* ===== INSERTAR USUARIO ===== */
$sqlUser = "INSERT INTO usuarios 
(Nombres_user, Apellidos_user, Cedula_user, Fecha_nacimiento, Edad_user,
 Usuario_user, Clave_user, Estado_user)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sqlUser);
$stmt->bind_param(
    "ssssisss",
    $Nombres_user,
    $Apellidos_user,
    $Cedula_user,
    $Fecha_nacimiento,
    $edad,
    $Usuario_user,
    $Clave_user,
    $Estado_user
);

if (!$stmt->execute()) {

    if ($stmt->errno == 1062) {
        header("Location: ../paginas/inicio.php?op=usuario_ingresar&error=cedula_duplicada");
        exit;
    } else {
        header("Location: ../paginas/inicio.php?op=usuario_ingresar&error=general");
        exit;
    }
}

$id_usuario = $stmt->insert_id;
$stmt->close();

/* ===== ASIGNAR ROLES (SI EXISTEN) ===== */
if (!empty($roles)) {

    $sqlRol = "INSERT INTO usuarios_rol (id_usuario, id_rol)
               VALUES (?, ?)";

    $stmtRol = $conn->prepare($sqlRol);

    foreach ($roles as $id_rol) {
        $stmtRol->bind_param("ii", $id_usuario, $id_rol);
        $stmtRol->execute();
    }

    $stmtRol->close();
}

/* ===== AUDITORÍA ===== */
include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
registrarAuditoria(
    $conn,
    "$actor agregó un usuario: $Nombres_user $Apellidos_user ($Usuario_user)"
);

$conn->close();

/* ===== REDIRECCIÓN ===== */
echo "<script>
alert('Usuario creado correctamente');
window.location.href = '../paginas/inicio.php';
</script>";