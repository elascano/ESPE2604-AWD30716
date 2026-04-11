<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('generar_reportes', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_POST['tipo_reporte'])) {
    die("Tipo de reporte no especificado");
}

require('../librerias/fpdf/fpdf.php');

$tipo = $_POST['tipo_reporte'];

/* ============================================================
   CREAR PDF
============================================================ */
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',14);

/* ===== ENCABEZADO ===== */
$pdf->Cell(0,10,'REPORTE DEL SISTEMA ACADEMICO',0,1,'C');
$pdf->SetFont('Arial','',10);
$pdf->Cell(0,6,'Generado por: '.$_SESSION['usuario'],0,1,'C');
$pdf->Cell(0,6,'Fecha: '.date('d/m/Y H:i'),0,1,'C');
$pdf->Ln(5);


/* ============================================================
   REPORTE AUDITORIA
============================================================ */
if ($tipo == "auditoria") {

    $pdf->SetFont('Arial','B',12);
    $pdf->Cell(0,8,'Reporte de Auditoria',0,1,'L');
    $pdf->Ln(3);

    $sql = "SELECT id_auditoria, fecha, hora, descripcion
            FROM auditoria
            WHERE 1=1";

    /* ===== FILTROS ===== */
    if (!empty($_POST['fecha_desde'])) {
        $fecha_desde = $_POST['fecha_desde'];
        $sql .= " AND fecha >= '$fecha_desde'";
    }

    if (!empty($_POST['fecha_hasta'])) {
        $fecha_hasta = $_POST['fecha_hasta'];
        $sql .= " AND fecha <= '$fecha_hasta'";
    }

    if (!empty($_POST['palabra_clave'])) {
        $palabra = $conn->real_escape_string($_POST['palabra_clave']);
        $sql .= " AND descripcion LIKE '%$palabra%'";
    }

    $sql .= " ORDER BY fecha DESC, hora DESC";

    $resultado = $conn->query($sql);

    /* ===== ENCABEZADO TABLA ===== */
    $pdf->SetFont('Arial','B',9);
    $pdf->Cell(20,7,'ID',1);
    $pdf->Cell(25,7,'Fecha',1);
    $pdf->Cell(20,7,'Hora',1);
    $pdf->Cell(125,7,'Descripcion',1);
    $pdf->Ln();

    $pdf->SetFont('Arial','',8);

    while ($row = $resultado->fetch_assoc()) {

        $pdf->Cell(20,6,$row['id_auditoria'],1);
        $pdf->Cell(25,6,$row['fecha'],1);
        $pdf->Cell(20,6,$row['hora'],1);
        $pdf->Cell(125,6,utf8_decode($row['descripcion']),1);
        $pdf->Ln();
    }
}


/* ============================================================
   REPORTE NOTAS
============================================================ */
if ($tipo == "notas") {

    $pdf->SetFont('Arial','B',12);
    $pdf->Cell(0,8,'Reporte de Notas',0,1,'L');
    $pdf->Ln(3);

    $sql = "SELECT 
                c.Nombre_curso,
                a.Nombre_alumno,
                a.Cedula_alumno,
                a.Nota_1,
                a.Nota_2,
                a.Nota_3,
                a.Promedio_alumno,
                a.Estado_alumno,
                a.Estado_alumno_AI
            FROM alumno a
            INNER JOIN curso c ON a.id_curso = c.id_curso
            WHERE 1=1";

    /* ===== FILTROS ===== */
    if (!empty($_POST['id_curso'])) {
        $id_curso = intval($_POST['id_curso']);
        $sql .= " AND a.id_curso = $id_curso";
    }

    if (!empty($_POST['estado_academico'])) {
        $estado_academico = $conn->real_escape_string($_POST['estado_academico']);
        $sql .= " AND a.Estado_alumno = '$estado_academico'";
    }

    if (!empty($_POST['estado_sistema'])) {
        $estado_sistema = $conn->real_escape_string($_POST['estado_sistema']);
        $sql .= " AND a.Estado_alumno_AI = '$estado_sistema'";
    }

    if (!empty($_POST['promedio_min'])) {
        $min = floatval($_POST['promedio_min']);
        $sql .= " AND a.Promedio_alumno >= $min";
    }

    if (!empty($_POST['promedio_max'])) {
        $max = floatval($_POST['promedio_max']);
        $sql .= " AND a.Promedio_alumno <= $max";
    }

    $sql .= " ORDER BY c.Nombre_curso, a.Nombre_alumno";

    $resultado = $conn->query($sql);

    /* ===== ENCABEZADO TABLA ===== */
    $pdf->SetFont('Arial','B',8);

    $pdf->Cell(25,7,'Curso',1);
    $pdf->Cell(30,7,'Alumno',1);
    $pdf->Cell(25,7,'Cedula',1);
    $pdf->Cell(15,7,'N1',1);
    $pdf->Cell(15,7,'N2',1);
    $pdf->Cell(15,7,'N3',1);
    $pdf->Cell(20,7,'Promedio',1);
    $pdf->Cell(25,7,'Estado',1);
    $pdf->Ln();

    $pdf->SetFont('Arial','',7);

    while ($row = $resultado->fetch_assoc()) {

        $pdf->Cell(25,6,utf8_decode($row['Nombre_curso']),1);
        $pdf->Cell(30,6,utf8_decode($row['Nombre_alumno']),1);
        $pdf->Cell(25,6,$row['Cedula_alumno'],1);
        $pdf->Cell(15,6,$row['Nota_1'],1);
        $pdf->Cell(15,6,$row['Nota_2'],1);
        $pdf->Cell(15,6,$row['Nota_3'],1);
        $pdf->Cell(20,6,$row['Promedio_alumno'],1);
        $pdf->Cell(25,6,$row['Estado_alumno'],1);
        $pdf->Ln();
    }
}


/* ============================================================
   SALIDA
============================================================ */
$pdf->Output("I","reporte.pdf");
exit;
