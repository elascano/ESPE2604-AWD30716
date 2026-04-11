<?php
session_start();

// ================= SEGURIDAD =================
if (!in_array('alumno_desaprobados', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

// ================= PAGINACIÓN =================
$registros_por_pagina = 5;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

// ================= TOTAL REGISTROS =================
$sql_total = "
SELECT COUNT(*) AS total
FROM alumno a
LEFT JOIN curso c ON a.id_curso = c.id_curso
WHERE a.Estado_alumno = 'Desaprobado'
";

$stmt_total = $conn->prepare($sql_total);
$stmt_total->execute();
$total_registros = $stmt_total->get_result()->fetch_assoc()['total'];
$total_paginas = ceil($total_registros / $registros_por_pagina);

// ================= LISTADO =================
$sql = "
SELECT 
    a.id_alumno,
    a.Nombre_alumno,
    c.Nombre_curso,
    a.Nota_1,
    a.Nota_2,
    a.Nota_3,
    a.Nota_recuperacion,
    a.Promedio_alumno,
    a.Estado_alumno
FROM alumno a
LEFT JOIN curso c ON a.id_curso = c.id_curso
WHERE a.Estado_alumno = 'Desaprobado'
ORDER BY a.Nombre_alumno ASC
LIMIT ?, ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $inicio, $registros_por_pagina);
$stmt->execute();
$result = $stmt->get_result();
?>

<h3 class="w3-center w3-text-red">ALUMNOS DESAPROBADOS</h3>

<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-red">
    <th>ID</th>
    <th>Alumno</th>
    <th>Curso</th>
    <th>N1</th>
    <th>N2</th>
    <th>N3</th>
    <th>Recup.</th>
    <th>Promedio</th>
    <th>Estado</th>
    <th>Acción</th>
</tr>

<?php if ($result->num_rows > 0): ?>
<?php while ($fila = $result->fetch_assoc()): ?>
<tr>
    <td><?= $fila['id_alumno'] ?></td>
    <td><?= htmlspecialchars($fila['Nombre_alumno']) ?></td>
    <td><?= $fila['Nombre_curso'] ?? 'Sin curso' ?></td>
    <td><?= $fila['Nota_1'] ?></td>
    <td><?= $fila['Nota_2'] ?></td>
    <td><?= $fila['Nota_3'] ?></td>
    <td><?= $fila['Nota_recuperacion'] ?? '-' ?></td>
    <td><?= number_format($fila['Promedio_alumno'], 2) ?></td>
    <td class="w3-text-red">
        <b><?= $fila['Estado_alumno'] ?></b>
    </td>
    <td>
        <form action="inicio.php?op=alumno_recuperacion" method="post">
            <input type="hidden" name="id_alumno" value="<?= $fila['id_alumno'] ?>">
            <button type="submit" class="w3-button w3-orange w3-small">
                Recuperación
            </button>
        </form>
    </td>
</tr>
<?php endwhile; ?>
<?php else: ?>
<tr>
    <td colspan="10" class="w3-center">No hay alumnos desaprobados</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=alumno_desaprobados&pagina=<?= $pagina - 1 ?>">
       Anterior
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Anterior</span>
<?php endif; ?>

<?php for ($i = 1; $i <= $total_paginas; $i++): ?>
    <?php if ($i == $pagina): ?>
        <span class="w3-button w3-red"><?= $i ?></span>
    <?php else: ?>
        <a class="w3-button w3-light-grey"
           href="inicio.php?op=alumno_desaprobados&pagina=<?= $i ?>">
           <?= $i ?>
        </a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=alumno_desaprobados&pagina=<?= $pagina + 1 ?>">
       Siguiente
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>
