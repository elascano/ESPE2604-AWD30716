<?php

require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST["nombre"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $telefono = trim($_POST["telefono"] ?? "");
    $fecha = trim($_POST["fecha"] ?? "");
    $hora = trim($_POST["hora"] ?? "");
    $corte = trim($_POST["corte"] ?? "");
    $cabello = trim($_POST["cabello"] ?? "");

    if (
        empty($nombre) ||
        empty($email) ||
        empty($telefono) ||
        empty($fecha) ||
        empty($hora) ||
        empty($corte) ||
        empty($cabello)
    ) {
        die("Todos los campos son obligatorios.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("El correo electrónico no es válido.");
    }

    try {
        $sql = "insert into public.citas
                (nombre, email, telefono, fecha, hora, corte, cabello)
                values
                (:nombre, :email, :telefono, :fecha, :hora, :corte, :cabello)";

        $stmt = $conexion->prepare($sql);

        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":telefono", $telefono);
        $stmt->bindParam(":fecha", $fecha);
        $stmt->bindParam(":hora", $hora);
        $stmt->bindParam(":corte", $corte);
        $stmt->bindParam(":cabello", $cabello);

        $stmt->execute();

        echo "Cita registrada correctamente.";

    } catch (PDOException $e) {
        echo "Error al guardar la cita: " . $e->getMessage();
    }
} else {
    echo "Método no permitido.";
}