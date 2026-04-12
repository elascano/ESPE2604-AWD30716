<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("../conexion.php");

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'] ?? null;
        $nombre = trim($_POST['nombre'] ?? '');
        $apellido = trim($_POST['apellido'] ?? '');
        $correo = trim($_POST['correo'] ?? '');
        $cedula = trim($_POST['cedula'] ?? '');
        $oldPassword = $_POST['oldPassword'] ?? '';
        $newPassword = $_POST['newPassword'] ?? '';

        if (empty($id) || empty($nombre) || empty($apellido) || empty($correo) || empty($cedula)) {
            throw new Exception("Campos incompletos");
        }

        // Verificar si la cédula o el correo ya existen en otro usuario
        $sqlCheck = "SELECT Id FROM usuarios WHERE (Correo = ? OR Cedula = ?) AND Id != ?";
        if (!$stmtCheck = $conn->prepare($sqlCheck)) {
            throw new Exception("Error en consulta: " . $conn->error);
        }

        $stmtCheck->bind_param("ssi", $correo, $cedula, $id);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            throw new Exception("Correo o Cédula ya registrados");
        }
        $stmtCheck->close();

        // Actualizar datos personales
        $sqlUpdate = "UPDATE usuarios SET Nombre = ?, Apellido = ?, Correo = ?, Cedula = ? WHERE Id = ?";
        if (!$stmtUpdate = $conn->prepare($sqlUpdate)) {
            throw new Exception("Error en actualización: " . $conn->error);
        }

        $stmtUpdate->bind_param("ssssi", $nombre, $apellido, $correo, $cedula, $id);
        if (!$stmtUpdate->execute()) {
            throw new Exception("Error al ejecutar: " . $stmtUpdate->error);
        }
        $stmtUpdate->close();

        // Si se desea cambiar la contraseña
        if (!empty($oldPassword) && !empty($newPassword)) {
            $sqlPass = "SELECT Password FROM usuarios WHERE Id = ?";
            if (!$stmtPass = $conn->prepare($sqlPass)) {
                throw new Exception("Error al verificar contraseña: " . $conn->error);
            }

            $stmtPass->bind_param("i", $id);
            $stmtPass->execute();
            $stmtPass->bind_result($hashedPassword);
            $stmtPass->fetch();
            $stmtPass->close();

            if (!password_verify($oldPassword, $hashedPassword)) {
                throw new Exception("Contraseña actual incorrecta");
            }

            $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $sqlUpdatePass = "UPDATE usuarios SET Password = ? WHERE Id = ?";
            if (!$stmtUpdatePass = $conn->prepare($sqlUpdatePass)) {
                throw new Exception("Error en actualización de contraseña: " . $conn->error);
            }

            $stmtUpdatePass->bind_param("si", $newPasswordHash, $id);
            if (!$stmtUpdatePass->execute()) {
                throw new Exception("Error al ejecutar cambio de contraseña: " . $stmtUpdatePass->error);
            }
            $stmtUpdatePass->close();
        }

        $_SESSION['nombre'] = $nombre;
        $_SESSION['apellido'] = $apellido;

        echo "success";
        $conn->close();
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
