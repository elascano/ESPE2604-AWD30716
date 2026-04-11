<?php
session_start();
require '../librerias/fpdf/fpdf.php';
include_once '../server/conexion.php';

/* ===== SEGURIDAD ===== */
if (!in_array('alumno_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS ===== */
$curso = $_GET['curso'] ?? '';

if (empty($curso)) {
    die("Curso no especificado");
}

/* ===== CONSULTA ===== */
$sql = "SELECT * FROM alumno WHERE Curso_alumno = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $curso);
$stmt->execute();
$result = $stmt->get_result();

/* ===== PDF ===== */
$pdf = new FPDF('L');
$pdf->AddPage();
$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,"Reporte de Alumnos - Curso $curso",0,1,'C');

$pdf->Ln(5);
$pdf->SetFont('Arial','B',10);

$pdf->Cell(10,8,'ID',1);
$pdf->Cell(50,8,'Nombre',1);
$pdf->Cell(20,8,'N1',1);
$pdf->Cell(20,8,'N2',1);
$pdf->Cell(20,8,'N3',1);
$pdf->Cell(30,8,'Recup.',1);
$pdf->Cell(30,8,'Promedio',1);
$pdf->Cell(30,8,'Estado',1);
$pdf->Ln();

$pdf->SetFont('Arial','',10);

while ($a = $result->fetch_assoc()) {
    $pdf->Cell(10,8,$a['id_alumno'],1);
    $pdf->Cell(50,8,$a['Nombre_alumno'],1);
    $pdf->Cell(20,8,$a['Nota_1'],1);
    $pdf->Cell(20,8,$a['Nota_2'],1);
    $pdf->Cell(20,8,$a['Nota_3'],1);
    $pdf->Cell(30,8,$a['Nota_recuperacion'] ?? '-',1);
    $pdf->Cell(30,8,$a['Promedio_alumno'],1);
    $pdf->Cell(30,8,$a['Estado_alumno'],1);
    $pdf->Ln();
}

$pdf->Output();
