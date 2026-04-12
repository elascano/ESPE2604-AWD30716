<?php
session_start();
// ================= SEGURIDAD =================
if (!in_array('alumno_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

// ================= PAGINACIÓN =================
$registros_por_pagina = 5;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

// ================= BUSQUEDA =================
$where = "";
$parametros_url = "";
$tipos = "";
$valores = [];

if (isset($_GET['buscar'])) {

    if ($_GET['buscar_por'] === 'nombre' && !empty($_GET['nombre'])) {
        $where = "WHERE a.Nombre_alumno LIKE ?";
        $tipos = "s";
        $valores[] = "%" . $_GET['nombre'] . "%";
        $parametros_url = "&buscar=1&buscar_por=nombre&nombre=" . $_GET['nombre'];
    }

    if ($_GET['buscar_por'] === 'curso' && !empty($_GET['curso'])) {
        $where = "WHERE a.id_curso = ?";
        $tipos = "i";
        $valores[] = intval($_GET['curso']);
        $parametros_url = "&buscar=1&buscar_por=curso&curso=" . $_GET['curso'];
    }
}

// ================= TOTAL REGISTROS =================
$sql_total = "
SELECT COUNT(*) AS total
FROM alumno a
LEFT JOIN curso c ON a.id_curso = c.id_curso
$where
";

$stmt_total = $conn->prepare($sql_total);

if ($where) {
    $stmt_total->bind_param($tipos, ...$valores);
}

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
    a.Estado_alumno,
	a.Estado_alumno_AI
FROM alumno a
LEFT JOIN curso c ON a.id_curso = c.id_curso
$where
LIMIT ?, ?
";

$stmt = $conn->prepare($sql);

if ($where) {
    $tipos .= "ii";
    $valores[] = $inicio;
    $valores[] = $registros_por_pagina;
    $stmt->bind_param($tipos, ...$valores);
} else {
    $stmt->bind_param("ii", $inicio, $registros_por_pagina);
}

$stmt->execute();
$result = $stmt->get_result();
?>

<h3 class="w3-center">LISTADO DE ALUMNOS</h3>

<!-- ================= FORMULARIO BUSQUEDA ================= -->
<form method="get" action="inicio.php" class="w3-center w3-margin-bottom">
    <input type="hidden" name="op" value="alumno_listar">

<script>
function toggleBusqueda(op) {
    document.getElementById('nombre').disabled = (op !== 'nombre');
    document.getElementById('curso').disabled  = (op !== 'curso');
}
</script>

<label>
    <input type="radio" name="buscar_por" value="nombre"
           onclick="toggleBusqueda('nombre')"
           <?= ($_GET['buscar_por'] ?? '') === 'nombre' ? 'checked' : '' ?>>
    Nombre
</label>
<input type="text" name="nombre" id="nombre"
       value="<?= $_GET['nombre'] ?? '' ?>"
       <?= ($_GET['buscar_por'] ?? '') === 'nombre' ? '' : 'disabled' ?>>

&nbsp;&nbsp;

<label>
    <input type="radio" name="buscar_por" value="curso"
           onclick="toggleBusqueda('curso')"
           <?= ($_GET['buscar_por'] ?? '') === 'curso' ? 'checked' : '' ?>>
    Curso
</label>
<input type="text" name="curso" id="curso"
       value="<?= $_GET['curso'] ?? '' ?>"
       <?= ($_GET['buscar_por'] ?? '') === 'curso' ? '' : 'disabled' ?>>

&nbsp;&nbsp;

<button class="w3-button w3-blue" type="submit" name="buscar" value="1">
    Buscar
</button>
<a class="w3-button w3-light-grey" href="inicio.php?op=alumno_listar">
    Limpiar
</a>
</form>

<!-- ================= TABLA ================= -->
<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-blue">
    <th>ID</th>
    <th>Nombre</th>
    <th>Curso</th>
    <th>Nota 1</th>
    <th>Nota 2</th>
    <th>Nota 3</th>
    <th>Recup.</th>
    <th>Promedio</th>
    <th>Estado Académico</th>
    <th>Estado Sistema</th>
    <th>Acciones</th>
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
    <td><?= $fila['Promedio_alumno'] ?></td>

    <!-- ESTADO ACADÉMICO -->
    <td>
        <?php if ($fila['Estado_alumno'] === 'Aprobado'): ?>
            <span class="w3-text-green"><strong>Aprobado</strong></span>
        <?php else: ?>
            <span class="w3-text-red"><strong>Desaprobado</strong></span>
        <?php endif; ?>
    </td>

    <!-- ESTADO SISTEMA -->
    <td>
        <?php if ($fila['Estado_alumno_AI'] === 'Activo'): ?>
            <span class="w3-text-green"><strong>Activo</strong></span>
        <?php else: ?>
            <span class="w3-text-red"><strong>Inactivo</strong></span>
        <?php endif; ?>
    </td>

    <td>

        <!-- EDITAR -->
        <?php if (in_array('usuario_editar_alumno', $_SESSION['permisos'])): ?>
            <form action="inicio.php?op=alumno_editar" method="post" style="display:inline;">
                <input type="hidden" name="id_alumno" value="<?= $fila['id_alumno'] ?>">
                <button type="submit" class="w3-button w3-blue w3-small">
                    Editar
                </button>
            </form>
        <?php endif; ?>

        <!-- ACTIVAR / DESACTIVAR -->
        <?php if (in_array('usuario_eliminar_alumno', $_SESSION['permisos'])): ?>

            <form action="../server/cambiar_estado_alumno.php"
                  method="post"
                  style="display:inline;"
                  onsubmit="return confirm('¿Está seguro de cambiar el estado del alumno?');">

                <input type="hidden" name="id_alumno" value="<?= $fila['id_alumno'] ?>">

                <input type="hidden" name="Estado_alumno_AI"
                       value="<?= $fila['Estado_alumno_AI'] === 'Activo' ? 'Inactivo' : 'Activo' ?>">

                <button type="submit"
                    class="w3-button w3-small 
                    <?= $fila['Estado_alumno_AI'] === 'Activo' ? 'w3-red' : 'w3-green' ?>">
                    
                    <?= $fila['Estado_alumno_AI'] === 'Activo' ? 'Desactivar' : 'Activar' ?>
                </button>
            </form>

        <?php endif; ?>

    </td>

</tr>
<?php endwhile; ?>

<?php else: ?>
<tr>
    <td colspan="11" class="w3-center">No hay registros</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=alumno_listar&pagina=<?= $pagina - 1 ?><?= $parametros_url ?>">
       Anterior
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Anterior</span>
<?php endif; ?>

<?php for ($i = 1; $i <= $total_paginas; $i++): ?>
    <?php if ($i == $pagina): ?>
        <span class="w3-button w3-blue"><?= $i ?></span>
    <?php else: ?>
        <a class="w3-button w3-light-grey"
           href="inicio.php?op=alumno_listar&pagina=<?= $i ?><?= $parametros_url ?>">
           <?= $i ?>
        </a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=alumno_listar&pagina=<?= $pagina + 1 ?><?= $parametros_url ?>">
       Siguiente
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>
