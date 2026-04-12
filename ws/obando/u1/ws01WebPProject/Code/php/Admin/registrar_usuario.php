<?php
include("../conexion.php");

$response = ["success" => false];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = $_POST["cedula"];
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $correo = $_POST["email"];
    $password = $_POST["password"];
    $rol = $_POST["rol"]; // Se añade la captura del rol

    // Verificar si la cédula ya está registrada
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE Cedula = ?");
    $stmt->bind_param("s", $cedula);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $response["error"] = "La cédula ya está registrada.";
        $stmt->close();
        echo json_encode($response);
        exit();
    }

    // Verificar si el correo ya está registrado
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE Correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $response["error"] = "El correo ya está registrado.";
        $stmt->close();
        echo json_encode($response);
        exit();
    }

    // Encriptar la contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insertar en la base de datos
    $stmt = $conn->prepare("INSERT INTO usuarios (Cedula, Nombre, Apellido, Correo, Password, Rol) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cedula, $nombre, $apellido, $correo, $passwordHash, $rol);

    if ($stmt->execute()) {
        $response["success"] = true;
    } else {
        $response["error"] = "Error en la consulta: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
