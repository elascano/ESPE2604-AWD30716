<?php
date_default_timezone_set('America/Guayaquil');

function registrarAuditoria(mysqli $conn, string $descripcion) {

    $fecha = date('Y-m-d');
    $hora  = date('H:i:s');

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'DESCONOCIDA';
    if ($ip === '::1') {
        $ip = '127.0.0.1';
    }

    $sql = "INSERT INTO auditoria (fecha, hora, descripcion, ip)
            VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $fecha, $hora, $descripcion, $ip);
    $stmt->execute();
    $stmt->close();
}
