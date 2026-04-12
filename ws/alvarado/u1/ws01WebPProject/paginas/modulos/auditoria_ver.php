<?php
session_start();

/* ================= SEGURIDAD ================= */
if (!in_array('auditoria_ver', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_SESSION['usuario'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

/* ================= PAGINACIÓN ================= */
$registros_por_pagina = 10;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

/* ================= BUSQUEDA ================= */
$where = "";
$parametros_url = "";
$tipos = "";
$valores = [];

if (isset($_GET['buscar']) && !empty($_GET['descripcion'])) {
    $where = "WHERE descripcion LIKE ?";
    $tipos = "s";
    $valores[] = "%" . $_GET['descripcion'] . "%";
    $parametros_url = "&buscar=1&descripcion=" . $_GET['descripcion'];
}

/* ================= TOTAL REGISTROS ================= */
$sql_total = "SELECT COUNT(*) AS total FROM auditoria $where";
$stmt_total = $conn->prepare($sql_total);

if ($where) {
    $stmt_total->bind_param($tipos, ...$valores);
}

$stmt_total->execute();
$total_registros = $stmt_total->get_result()->fetch_assoc()['total'];
$total_paginas = ceil($total_registros / $registros_por_pagina);

/* ================= LISTADO ================= */
$sql = "
SELECT 
    fecha,
    hora,
    descripcion,
    ip
FROM auditoria
$where
ORDER BY fecha DESC, hora DESC
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

<h3 class="w3-center">AUDITORÍA DEL SISTEMA</h3>

<!-- ================= FORMULARIO BUSQUEDA ================= -->
<form method="get" action="inicio.php" class="w3-center w3-margin-bottom">
    <input type="hidden" name="op" value="auditoria_ver">

    <label>Descripción:</label>
    <input type="text" name="descripcion" value="<?= $_GET['descripcion'] ?? '' ?>">

    <button class="w3-button w3-blue" type="submit" name="buscar" value="1">
        Buscar
    </button>

    <a class="w3-button w3-light-grey" href="inicio.php?op=auditoria_ver">
        Limpiar
    </a>
</form>

<!-- ================= TABLA ================= -->
<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-blue">
    <th>Fecha</th>
    <th>Hora</th>
    <th>Descripción</th>
    <th>IP</th>
</tr>

<?php if ($result->num_rows > 0): ?>
<?php while ($fila = $result->fetch_assoc()): ?>
<tr>
    <td><?= $fila['fecha'] ?></td>
    <td><?= $fila['hora'] ?></td>
    <td><?= htmlspecialchars($fila['descripcion']) ?></td>
    <td><?= $fila['ip'] ?></td>
</tr>
<?php endwhile; ?>
<?php else: ?>
<tr>
    <td colspan="4" class="w3-center">No hay registros de auditoría</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=auditoria_ver&pagina=<?= $pagina - 1 ?><?= $parametros_url ?>">
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
           href="inicio.php?op=auditoria_ver&pagina=<?= $i ?><?= $parametros_url ?>">
           <?= $i ?>
        </a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=auditoria_ver&pagina=<?= $pagina + 1 ?><?= $parametros_url ?>">
       Siguiente
    </a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>
