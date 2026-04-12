<?php
session_start();
require '../librerias/fpdf/fpdf.php';
include_once '../server/conexion.php';

if (!in_array('alumno_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

$sql = "SELECT * FROM alumno WHERE Estado_alumno = 'Desaprobado'";
$result = $conn->query($sql);

$pdf = new FPDF('L');
$pdf->AddPage();
$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,"Reporte de Alumnos Desaprobados",0,1,'C');

$pdf->Ln(5);
$pdf->SetFont('Arial','B',10);

$pdf->Cell(10,8,'ID',1);
$pdf->Cell(50,8,'Nombre',1);
$pdf->Cell(30,8,'Curso',1);
$pdf->Cell(30,8,'Promedio',1);
$pdf->Cell(40,8,'Recuperación',1);
$pdf->Ln();

$pdf->SetFont('Arial','',10);

while ($a = $result->fetch_assoc()) {
    $pdf->Cell(10,8,$a['id_alumno'],1);
    $pdf->Cell(50,8,$a['Nombre_alumno'],1);
    $pdf->Cell(30,8,$a['Curso_alumno'],1);
    $pdf->Cell(30,8,$a['Promedio_alumno'],1);
    $pdf->Cell(40,8,$a['Nota_recuperacion'] ?? 'Pendiente',1);
    $pdf->Ln();
}

$pdf->Output();
