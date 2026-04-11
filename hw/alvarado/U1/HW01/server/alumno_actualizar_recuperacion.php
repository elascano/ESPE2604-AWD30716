<?php
session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('alumno_recuperacion', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== VALIDAR DATOS ===== */
if (
    !isset($_POST['id_alumno']) ||
    !isset($_POST['Nota_recuperacion'])
) {
    die("Datos incompletos");
}

$id_alumno = intval($_POST['id_alumno']);
$nota_recuperacion = floatval($_POST['Nota_recuperacion']);

/* ===== VALIDAR RANGO ===== */
if ($nota_recuperacion < 0 || $nota_recuperacion > 20) {
    die("La nota debe estar entre 0 y 20");
}

/* ===== OBTENER NOTAS EXISTENTES ===== */
$sql = "
SELECT 
    Nota_1,
    Nota_2,
    Nota_3
FROM alumno
WHERE id_alumno = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_alumno);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Alumno no encontrado");
}

$alumno = $result->fetch_assoc();
$stmt->close();

/* ===== CALCULAR PROMEDIO (4 NOTAS) ===== */
$promedio = (
    $alumno['Nota_1'] +
    $alumno['Nota_2'] +
    $alumno['Nota_3'] +
    $nota_recuperacion
) / 4;

/* ===== ESTADO ===== */
$estado = ($promedio >= 14) ? 'Aprobado' : 'Desaprobado';

/* ===== ACTUALIZAR ===== */
$sqlUpdate = "
UPDATE alumno
SET 
    Nota_recuperacion = ?,
    Promedio_alumno = ?,
    Estado_alumno = ?
WHERE id_alumno = ?
";

$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param(
    "ddsi",
    $nota_recuperacion,
    $promedio,
    $estado,
    $id_alumno
);

if ($stmtUpdate->execute()) {
    header("Location: ../paginas/inicio.php?op=alumno_desaprobados&ok=1");
} else {
    die("Error al actualizar");
}

$stmtUpdate->close();
$conn->close();
