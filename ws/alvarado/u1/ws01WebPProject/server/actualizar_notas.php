<?php
session_start();
include_once "conexion.php";

/* ================= SEGURIDAD ================= */

if (!isset($_SESSION['usuario']) || 
    !in_array('alumno_notas', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_POST['id_alumno'])) {
    die("Alumno no especificado");
}

/* ================= DATOS ================= */

$id_alumno = intval($_POST['id_alumno']);

$Nota_1 = floatval($_POST['Nota_1'] ?? 0);
$Nota_2 = floatval($_POST['Nota_2'] ?? 0);
$Nota_3 = floatval($_POST['Nota_3'] ?? 0);

/* ================= VALIDACIÓN DE RANGO ================= */

foreach ([$Nota_1, $Nota_2, $Nota_3] as $nota) {
    if ($nota < 0 || $nota > 10) {
        die("Las notas deben estar entre 0 y 10");
    }
}

/* ================= VERIFICAR EXISTENCIA ================= */

$sqlExiste = "SELECT Nombre_alumno FROM alumno WHERE id_alumno = ?";
$stmtExiste = $conn->prepare($sqlExiste);
$stmtExiste->bind_param("i", $id_alumno);
$stmtExiste->execute();
$resultExiste = $stmtExiste->get_result();

if ($resultExiste->num_rows === 0) {
    die("Alumno no encontrado");
}

$alumno = $resultExiste->fetch_assoc();
$Nombre_alumno = $alumno['Nombre_alumno'];

$stmtExiste->close();

/* ================= CALCULAR PROMEDIO ================= */

$Promedio = round(($Nota_1 + $Nota_2 + $Nota_3) / 3, 2);

/* Regla de aprobación */
$Estado = ($Promedio >= 7) ? "Aprobado" : "Desaprobado";

/* ================= ACTUALIZAR ================= */

$sqlUpdate = "
UPDATE alumno 
SET 
    Nota_1 = ?,
    Nota_2 = ?,
    Nota_3 = ?,
    Promedio_alumno = ?,
    Estado_alumno = ?
WHERE id_alumno = ?
";

$stmtUpdate = $conn->prepare($sqlUpdate);

if (!$stmtUpdate) {
    die($conn->error);
}

$stmtUpdate->bind_param(
    "ddddsi",
    $Nota_1,
    $Nota_2,
    $Nota_3,
    $Promedio,
    $Estado,
    $id_alumno
);

$stmtUpdate->execute();
$stmtUpdate->close();

/* ================= AUDITORÍA ================= */

include_once "auditoria.php";

$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor actualizó notas del alumno $Nombre_alumno (Promedio: $Promedio, Estado: $Estado)"
);

/* ================= FIN ================= */

$conn->close();

header("Location: ../paginas/inicio.php?op=alumno_notas&estado=actualizado");
exit;
?>
