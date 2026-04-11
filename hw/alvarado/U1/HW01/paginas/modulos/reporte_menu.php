<?php
session_start();

/* ================= SEGURIDAD ================= */
if (!in_array('reporte_generar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}
?>

<div class="w3-container w3-card w3-padding w3-margin-top">

<h3 class="w3-text-blue">Generación de Reportes</h3>

<p class="w3-text-grey">
Seleccione el tipo de reporte que desea generar:
</p>

<div class="w3-row-padding w3-margin-top">

    <!-- REPORTE POR CURSO -->
    <div class="w3-third">
        <div class="w3-card w3-padding w3-center">
            <h4>Reporte por Curso</h4>
            <p>Listado completo de alumnos por curso.</p>
            <a href="inicio.php?op=reporte_curso"
               class="w3-button w3-blue w3-block">
               Generar
            </a>
        </div>
    </div>

    <!-- REPORTE POR CURSO Y ESTADO -->
    <div class="w3-third">
        <div class="w3-card w3-padding w3-center">
            <h4>Reporte por Curso y Estado</h4>
            <p>Filtra alumnos aprobados o desaprobados por curso.</p>
            <a href="inicio.php?op=reporte_curso_estado"
               class="w3-button w3-green w3-block">
               Generar
            </a>
        </div>
    </div>

    <!-- REPORTE DESAPROBADOS -->
    <div class="w3-third">
        <div class="w3-card w3-padding w3-center">
            <h4>Reporte de Desaprobados</h4>
            <p>Listado general de alumnos desaprobados.</p>
            <a href="inicio.php?op=reporte_desaprobados"
               class="w3-button w3-red w3-block">
               Generar
            </a>
        </div>
    </div>

</div>

</div>
