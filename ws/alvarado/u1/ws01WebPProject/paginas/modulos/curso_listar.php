<?php
session_start();

/* ================= SEGURIDAD ================= */
if (!isset($_SESSION['usuario']) || 
    !in_array('curso_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

$registros_por_pagina = 5;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

/* ================= FILTROS ================= */
$where = [];
$tipos = "";
$valores = [];
$parametros_url = "";

/* ===== BUSQUEDA POR NOMBRE ===== */
if (!empty($_GET['nombre'])) {
    $where[] = "Nombre_curso LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $_GET['nombre'] . "%";
    $parametros_url .= "&nombre=" . $_GET['nombre'];
}

/* ===== FILTRO ESTADO ===== */
if (!empty($_GET['estado']) && in_array($_GET['estado'], ['Activo','Inactivo'])) {
    $where[] = "Estado_curso = ?";
    $tipos .= "s";
    $valores[] = $_GET['estado'];
    $parametros_url .= "&estado=" . $_GET['estado'];
}

/* Construir WHERE */
$where_sql = "";
if (count($where) > 0) {
    $where_sql = "WHERE " . implode(" AND ", $where);
}

/* ================= TOTAL ================= */
$sql_total = "SELECT COUNT(*) AS total FROM curso $where_sql";
$stmt_total = $conn->prepare($sql_total);

if (!empty($where)) {
    $stmt_total->bind_param($tipos, ...$valores);
}

$stmt_total->execute();
$total_registros = $stmt_total->get_result()->fetch_assoc()['total'];
$total_paginas = ceil($total_registros / $registros_por_pagina);

/* ================= LISTADO ================= */
$sql = "
SELECT id_curso, Nombre_curso, Descripcion_curso, Estado_curso
FROM curso
$where_sql
ORDER BY Estado_curso = 'Activo' DESC, Nombre_curso ASC
LIMIT ?, ?
";

$stmt = $conn->prepare($sql);

$tipos_listado = $tipos . "ii";
$valores_listado = $valores;
$valores_listado[] = $inicio;
$valores_listado[] = $registros_por_pagina;

if (!empty($where)) {
    $stmt->bind_param($tipos_listado, ...$valores_listado);
} else {
    $stmt->bind_param("ii", $inicio, $registros_por_pagina);
}

$stmt->execute();
$result = $stmt->get_result();
?>

<h3 class="w3-center">LISTADO DE CURSOS</h3>

<form method="get" action="inicio.php" class="w3-center w3-margin-bottom">
    <input type="hidden" name="op" value="curso_listar">

    <label>Nombre:</label>
    <input type="text" name="nombre" value="<?= $_GET['nombre'] ?? '' ?>">

    &nbsp;&nbsp;

    <label>Estado:</label>
    <select name="estado">
        <option value="">Todos</option>
        <option value="Activo" <?= ($_GET['estado'] ?? '') === 'Activo' ? 'selected' : '' ?>>Activo</option>
        <option value="Inactivo" <?= ($_GET['estado'] ?? '') === 'Inactivo' ? 'selected' : '' ?>>Inactivo</option>
    </select>

    &nbsp;&nbsp;

    <button class="w3-button w3-blue" type="submit">Filtrar</button>
    <a class="w3-button w3-light-grey" href="inicio.php?op=curso_listar">Limpiar</a>
</form>

<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-blue">
    <th>ID</th>
    <th>Nombre</th>
    <th>Descripción</th>
    <th>Estado</th>
    <th>Acciones</th>
</tr>

<?php if ($result->num_rows > 0): ?>
<?php while ($fila = $result->fetch_assoc()): ?>

<tr class="<?= $fila['Estado_curso'] === 'Inactivo' ? 'w3-light-grey' : '' ?>">

    <td><?= $fila['id_curso'] ?></td>

    <td><?= htmlspecialchars($fila['Nombre_curso']) ?></td>

    <td><?= htmlspecialchars($fila['Descripcion_curso']) ?></td>

    <td>
        <?php if ($fila['Estado_curso'] === 'Activo'): ?>
            <span class="w3-text-green"><strong>Activo</strong></span>
        <?php else: ?>
            <span class="w3-text-red"><strong>Inactivo</strong></span>
        <?php endif; ?>
    </td>

    <td>

        <!-- EDITAR -->
        <?php if (in_array('curso_editar', $_SESSION['permisos'])): ?>
            <form action="inicio.php?op=curso_editar" 
                  method="post" 
                  style="display:inline;">
                <input type="hidden" name="id_curso" 
                       value="<?= $fila['id_curso'] ?>">
                <button type="submit" 
                        class="w3-button w3-blue w3-small">
                    Editar
                </button>
            </form>
        <?php endif; ?>

        <!-- ACTIVAR / DESACTIVAR -->
        <?php if (in_array('curso_eliminar', $_SESSION['permisos'])): ?>
            <form action="../server/cambiar_estado_curso.php"
                  method="post"
                  style="display:inline;"
                  onsubmit="return confirm('¿Está seguro de cambiar el estado del curso?');">

                <input type="hidden" name="id_curso" 
                       value="<?= $fila['id_curso'] ?>">

                <input type="hidden" name="Estado_curso"
                       value="<?= $fila['Estado_curso'] === 'Activo' ? 'Inactivo' : 'Activo' ?>">

                <button type="submit"
                    class="w3-button w3-small 
                    <?= $fila['Estado_curso'] === 'Activo' ? 'w3-red' : 'w3-green' ?>">

                    <?= $fila['Estado_curso'] === 'Activo' ? 'Desactivar' : 'Activar' ?>

                </button>
            </form>
        <?php endif; ?>

    </td>

</tr>

<?php endwhile; ?>
<?php else: ?>
<tr>
    <td colspan="5" class="w3-center">No hay registros</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=curso_listar&pagina=<?= $pagina - 1 ?><?= $parametros_url ?>">Anterior</a>
<?php else: ?>
    <span class="w3-button w3-disabled">Anterior</span>
<?php endif; ?>

<?php for ($i = 1; $i <= $total_paginas; $i++): ?>
    <?php if ($i == $pagina): ?>
        <span class="w3-button w3-blue"><?= $i ?></span>
    <?php else: ?>
        <a class="w3-button w3-light-grey"
           href="inicio.php?op=curso_listar&pagina=<?= $i ?><?= $parametros_url ?>"><?= $i ?></a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=curso_listar&pagina=<?= $pagina + 1 ?><?= $parametros_url ?>">Siguiente</a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>
