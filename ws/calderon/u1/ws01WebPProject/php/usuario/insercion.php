<?php
include_once("../conexion.php");

$usuario   = $_POST['usuario'];
$nombre    = $_POST['nombre'];
$apellido  = $_POST['apellido'];
$cedula    = $_POST['cedula'];
$clave     = password_hash($_POST['clave'], PASSWORD_DEFAULT);
$fecha_nac = $_POST['fecha_nacimiento'];
$estado    = 'activo';

try {
    $fechaObj = new DateTime($fecha_nac);
    $hoy      = new DateTime();
    $edad     = $hoy->diff($fechaObj);

    if ($edad->y < 18) {
        echo "Error: El usuario debe ser mayor de edad para registrarse (Tiene " . $edad->y . " años).";
        exit; 
    }
} catch (Exception $e) {
    echo "Error: Formato de fecha inválido.";
    exit;
}

$check = $conn->query("SELECT id_user FROM users WHERE usuario_user = '$usuario' OR cedula_user = '$cedula'");
if ($check->num_rows > 0) {
    echo "Error: El usuario o la cédula ya existen.";
    exit;
}

$sql = "INSERT INTO users 
(usuario_user, nombre_user, apellido_user, cedula_user, clave_user, fecha_nacimiento, estado_user, intentos_fallidos) 
VALUES (?, ?, ?, ?, ?, ?, ?, 0)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $usuario, $nombre, $apellido, $cedula, $clave, $fecha_nac, $estado);

if ($stmt->execute()) {
    registrarAuditoria($conn, "Registrar Usuario", "Nuevo registro: $usuario - Cédula: $cedula");

    echo "exito"; 
} else {
    echo "Error al registrar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>