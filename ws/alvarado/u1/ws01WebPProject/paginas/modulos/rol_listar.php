<?php
// ================= SEGURIDAD =================
if (!in_array('rol_listar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

// ================= PAGINACIÓN =================
$registros_por_pagina = 5;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

// ================= BUSQUEDA POR NOMBRE =================
$where = "";
$parametros_url = "";
$tipos = "";
$valores = [];

if (isset($_GET['buscar']) && !empty($_GET['nombre'])) {
    $where = "WHERE Nombre_rol LIKE ?";
    $tipos = "s";
    $valores[] = "%" . $_GET['nombre'] . "%";
    $parametros_url = "&buscar=1&nombre=" . $_GET['nombre'];
}

// ================= TOTAL REGISTROS =================
$sql_total = "SELECT COUNT(*) AS total FROM rol $where";
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
    id_rol,
    Nombre_rol,
    Descripcion_rol,
	Estado_rol
FROM rol
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

<h3 class="w3-center">LISTADO DE ROLES</h3>

<!-- ================= FORMULARIO BUSQUEDA ================= -->
<form method="get" action="inicio.php" class="w3-center w3-margin-bottom">
    <input type="hidden" name="op" value="rol_listar">

    <label>Nombre del Rol:</label>
    <input type="text" name="nombre" value="<?= $_GET['nombre'] ?? '' ?>">

    <button class="w3-button w3-blue" type="submit" name="buscar" value="1">
        Buscar
    </button>

    <a class="w3-button w3-light-grey" href="inicio.php?op=rol_listar">
        Limpiar
    </a>
</form>

<!-- ================= TABLA ================= -->
<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-blue">
    <th>ID</th>
    <th>Nombre del Rol</th>
    <th>Descripción</th>
	<th>Estado</th>
</tr>

<?php if ($result->num_rows > 0): ?>
<?php while ($fila = $result->fetch_assoc()): ?>
<tr>
    <td><?= $fila['id_rol'] ?></td>
    <td><?= $fila['Nombre_rol'] ?></td>
    <td><?= $fila['Descripcion_rol'] ?></td>
	<td>
        <?php if ($fila['Estado_rol'] === 'Activo'): ?>
            <span class="w3-text-green">Activo</span>
        <?php else: ?>
            <span class="w3-text-red">Inactivo</span>
        <?php endif; ?>
    </td>
</tr>
<?php endwhile; ?>
<?php else: ?>
<tr>
    <td colspan="4" class="w3-center">No hay registros</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=rol_listar&pagina=<?= $pagina - 1 ?><?= $parametros_url ?>">
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
           href="inicio.php?op=rol_listar&pagina=<?= $i ?><?= $parametros_url ?>">
           <?= $i ?>
        </a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=rol_listar&pagina=<?= $pagina + 1 ?><?= $parametros_url ?>">
       Siguiente
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>
