<?php
session_start();
include_once 'conexion.php';

// ================= SEGURIDAD =================
if (!in_array('rol_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

// ================= VALIDACIÓN =================
if (
    !isset($_POST['Nombre_rol'], $_POST['Descripcion_rol']) ||
    empty($_POST['Nombre_rol']) ||
    empty($_POST['Descripcion_rol'])
) {
    die("Datos incompletos");
}

$Nombre_rol      = trim($_POST['Nombre_rol']);
$Descripcion_rol = trim($_POST['Descripcion_rol']);
$permisos        = $_POST['permisos'] ?? [];

// ================= VERIFICAR DUPLICADOS =================
$sqlCheck = "SELECT id_rol FROM rol WHERE Nombre_rol = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("s", $Nombre_rol);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    echo "<script>
        alert('El nombre del rol ya existe');
        history.back();
    </script>";
    exit;
}

// ================= INSERTAR ROL =================
$sqlRol = "INSERT INTO rol (Nombre_rol, Descripcion_rol)
           VALUES (?, ?)";

$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("ss", $Nombre_rol, $Descripcion_rol);
$stmtRol->execute();

$id_rol = $stmtRol->insert_id;

// ================= ASIGNAR PERMISOS =================
if (!empty($permisos)) {

    $sqlPerm = "INSERT INTO permisos (id_rol, id_opcion)
                VALUES (?, ?)";

    $stmtPerm = $conn->prepare($sqlPerm);

    foreach ($permisos as $id_opcion) {
        $stmtPerm->bind_param("ii", $id_rol, $id_opcion);
        $stmtPerm->execute();
    }
}


include_once 'auditoria.php';

$actor = $_SESSION['usuario'];
registrarAuditoria(
    $conn,
    "$actor creó el rol: $Nombre_rol"
);



// ================= RESPUESTA =================
echo "<script>
alert('Rol creado correctamente');
window.location.href = '../paginas/inicio.php';
</script>";
