<?php
// Seguridad
if (!in_array('usuario_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

$registros_por_pagina = 5;
$pagina = isset($_GET['pagina']) ? max(1, intval($_GET['pagina'])) : 1;
$inicio = ($pagina - 1) * $registros_por_pagina;

/* ================= BUSQUEDA ================= */
$where = "";
$parametros_url = "";
$tipos = "";
$valores = [];

if (isset($_GET['buscar'])) {

    if ($_GET['buscar_por'] === 'cedula' && !empty($_GET['cedula'])) {
        $where = "WHERE u.Cedula_user LIKE ?";
        $tipos = "s";
        $valores[] = "%" . $_GET['cedula'] . "%";
        $parametros_url = "&buscar=1&buscar_por=cedula&cedula=" . $_GET['cedula'];
    }

    if ($_GET['buscar_por'] === 'nombre' && !empty($_GET['nombre'])) {
        $where = "WHERE u.Nombres_user LIKE ?";
        $tipos = "s";
        $valores[] = "%" . $_GET['nombre'] . "%";
        $parametros_url = "&buscar=1&buscar_por=nombre&nombre=" . $_GET['nombre'];
    }
}

/* ================= TOTAL ================= */
$sql_total = "SELECT COUNT(*) AS total FROM usuarios u $where";
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
    u.id_usuario,
    u.Nombres_user,
    u.Apellidos_user,
    u.Usuario_user,
    u.Cedula_user,
    u.Fecha_nacimiento,
    u.Edad_user,
    u.Estado_user,
    r.Nombre_rol
FROM usuarios u
LEFT JOIN usuarios_rol ur ON u.id_usuario = ur.id_usuario
LEFT JOIN rol r ON ur.id_rol = r.id_rol
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

<h3 class="w3-center">LISTADO DE USUARIOS</h3>

<form method="get" action="inicio.php" class="w3-center w3-margin-bottom">
    <input type="hidden" name="op" value="usuario_editar_buscar">

<script>
function toggleBusqueda(op) {
    document.getElementById('cedula').disabled = (op !== 'cedula');
    document.getElementById('nombre').disabled = (op !== 'nombre');
}
</script>

<label>
    <input type="radio" name="buscar_por" value="cedula"
           onclick="toggleBusqueda('cedula')" <?= ($_GET['buscar_por'] ?? '') === 'cedula' ? 'checked' : '' ?>>
    Cédula
</label>
<input type="text" name="cedula" id="cedula"
       value="<?= $_GET['cedula'] ?? '' ?>"
       <?= ($_GET['buscar_por'] ?? '') === 'cedula' ? '' : 'disabled' ?>>

&nbsp;&nbsp;

<label>
    <input type="radio" name="buscar_por" value="nombre"
           onclick="toggleBusqueda('nombre')" <?= ($_GET['buscar_por'] ?? '') === 'nombre' ? 'checked' : '' ?>>
    Nombre
</label>
<input type="text" name="nombre" id="nombre"
       value="<?= $_GET['nombre'] ?? '' ?>"
       <?= ($_GET['buscar_por'] ?? '') === 'nombre' ? '' : 'disabled' ?>>

&nbsp;&nbsp;

<button class="w3-button w3-blue" type="submit" name="buscar" value="1">Buscar</button>
<a class="w3-button w3-light-grey" href="inicio.php?op=usuario_editar_buscar">Limpiar</a>

</form>


<table class="w3-table w3-bordered w3-striped w3-small">
<tr class="w3-blue">
    <th>ID</th>
    <th>Nombres</th>
    <th>Apellidos</th>
    <th>Usuario</th>
    <th>Cédula</th>
    <th>Fecha Nac.</th>
    <th>Edad</th>
    <th>Rol</th>
    <th>Estado</th>
	<th>Acción</th>
</tr>

<?php if ($result->num_rows > 0): ?>
<?php while ($fila = $result->fetch_assoc()): ?>
<tr>
    <td><?= $fila['id_usuario'] ?></td>
    <td><?= $fila['Nombres_user'] ?></td>
    <td><?= $fila['Apellidos_user'] ?></td>
    <td><?= $fila['Usuario_user'] ?></td>
    <td><?= $fila['Cedula_user'] ?></td>
    <td><?= date('d/m/Y', strtotime($fila['Fecha_nacimiento'])) ?></td>
    <td><?= $fila['Edad_user'] ?></td>
    <td><?= $fila['Nombre_rol'] ?? 'Sin rol' ?></td>
    <td>
        <?php if ($fila['Estado_user'] === 'Activo'): ?>
            <span class="w3-text-green">Activo</span>
        <?php else: ?>
            <span class="w3-text-red">Inactivo</span>
        <?php endif; ?>
    </td>
	<td>
		<form action="inicio.php?op=usuario_editar" method="post">
			<input type="hidden" name="id_usuario" value="<?= $fila['id_usuario'] ?>">
			<button type="submit">ACTUALIZAR</button>
		</form>
	</td>
</tr>
<?php endwhile; ?>
<?php else: ?>
<tr>
    <td colspan="10" class="w3-center">No hay registros</td>
</tr>
<?php endif; ?>
</table>

<!-- ================= PAGINACIÓN ================= -->
<div class="w3-center w3-margin-top">

<?php if ($pagina > 1): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=usuario_editar_buscar&pagina=<?= $pagina - 1 ?><?= $parametros_url ?>">Anterior</a>
<?php else: ?>
    <span class="w3-button w3-disabled">Anterior</span>
<?php endif; ?>

<?php for ($i = 1; $i <= $total_paginas; $i++): ?>
    <?php if ($i == $pagina): ?>
        <span class="w3-button w3-blue"><?= $i ?></span>
    <?php else: ?>
        <a class="w3-button w3-light-grey"
           href="inicio.php?op=usuario_editar_buscar&pagina=<?= $i ?><?= $parametros_url ?>"><?= $i ?></a>
    <?php endif; ?>
<?php endfor; ?>

<?php if ($pagina < $total_paginas): ?>
    <a class="w3-button w3-light-grey"
       href="inicio.php?op=usuario_editar_buscar&pagina=<?= $pagina + 1 ?><?= $parametros_url ?>">Siguiente</a>
<?php else: ?>
    <span class="w3-button w3-disabled">Siguiente</span>
<?php endif; ?>

</div>