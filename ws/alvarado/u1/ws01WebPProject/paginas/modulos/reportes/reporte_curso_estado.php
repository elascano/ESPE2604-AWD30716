<?php
session_start();
require '../librerias/fpdf/fpdf.php';
include_once '../server/conexion.php';

if (!in_array('alumno_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

$curso  = $_GET['curso']  ?? '';
$estado = $_GET['estado'] ?? '';

if (empty($curso) || empty($estado)) {
    die("Datos incompletos");
}

$sql = "
SELECT * FROM alumno 
WHERE Curso_alumno = ? AND Estado_alumno = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $curso, $estado);
$stmt->execute();
$result = $stmt->get_result();

$pdf = new FPDF('L');
$pdf->AddPage();
$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,"Reporte $estado - Curso $curso",0,1,'C');

$pdf->Ln(5);
$pdf->SetFont('Arial','B',10);

$pdf->Cell(10,8,'ID',1);
$pdf->Cell(60,8,'Nombre',1);
$pdf->Cell(30,8,'Promedio',1);
$pdf->Cell(30,8,'Estado',1);
$pdf->Ln();

$pdf->SetFont('Arial','',10);

while ($a = $result->fetch_assoc()) {
    $pdf->Cell(10,8,$a['id_alumno'],1);
    $pdf->Cell(60,8,$a['Nombre_alumno'],1);
    $pdf->Cell(30,8,$a['Promedio_alumno'],1);
    $pdf->Cell(30,8,$a['Estado_alumno'],1);
    $pdf->Ln();
}

$pdf->Output();
