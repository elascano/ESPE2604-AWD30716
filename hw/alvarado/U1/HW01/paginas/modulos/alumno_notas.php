<?php
session_start();

if (!isset($_SESSION['usuario']) || 
    !in_array('alumno_notas', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

/* ================= FILTROS ================= */

$where = [];
$tipos = "";
$valores = [];

/* Buscar por curso */
if (!empty($_GET['curso'])) {
    $where[] = "c.Nombre_curso LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $_GET['curso'] . "%";
}

/* Buscar por nombre */
if (!empty($_GET['nombre'])) {
    $where[] = "a.Nombre_alumno LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $_GET['nombre'] . "%";
}

/* Buscar por cédula */
if (!empty($_GET['cedula'])) {
    $where[] = "a.Cedula_alumno LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $_GET['cedula'] . "%";
}

/* Solo activos */
$where[] = "a.Estado_alumno_AI = 'Activo'";
$where[] = "c.Estado_curso = 'Activo'";

$where_sql = "WHERE " . implode(" AND ", $where);

/* ================= CONSULTA ================= */

$sql = "
SELECT 
    a.id_alumno,
    a.Nombre_alumno,
    a.Cedula_alumno,
    c.Nombre_curso,
    a.Nota_1,
    a.Nota_2,
    a.Nota_3,
    a.Promedio_alumno,
    a.Estado_alumno
FROM alumno a
INNER JOIN curso c ON a.id_curso = c.id_curso
$where_sql
ORDER BY c.Nombre_curso, a.Nombre_alumno
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die($conn->error);
}

if (!empty($valores)) {
    $stmt->bind_param($tipos, ...$valores);
}

$stmt->execute();
$result = $stmt->get_result();
?>

<h3 class="w3-center">GESTIÓN DE NOTAS</h3>

<form method="get" action="inicio.php" 
      class="w3-container w3-card w3-padding w3-margin-bottom">

    <input type="hidden" name="op" value="alumno_notas">

    <input class="w3-input w3-border w3-margin-bottom"
           type="text"
           name="curso"
           placeholder="Buscar por curso"
           value="<?= $_GET['curso'] ?? '' ?>">

    <input class="w3-input w3-border w3-margin-bottom"
           type="text"
           name="nombre"
           placeholder="Buscar por nombre"
           value="<?= $_GET['nombre'] ?? '' ?>">

    <input class="w3-input w3-border w3-margin-bottom"
           type="text"
           name="cedula"
           placeholder="Buscar por cédula"
           value="<?= $_GET['cedula'] ?? '' ?>">

    <button class="w3-button w3-blue">Filtrar</button>
</form>

<table class="w3-table w3-bordered w3-striped w3-small">

<tr class="w3-blue">
    <th>Curso</th>
    <th>Alumno</th>
    <th>Cédula</th>
    <th>Nota 1</th>
    <th>Nota 2</th>
    <th>Nota 3</th>
    <th>Promedio</th>
    <th>Estado</th>
    <th>Guardar</th>
</tr>

<?php while ($fila = $result->fetch_assoc()): ?>

<tr>
<form method="post" action="../server/actualizar_notas.php">

    <input type="hidden" name="id_alumno" value="<?= $fila['id_alumno'] ?>">

    <td><?= htmlspecialchars($fila['Nombre_curso']) ?></td>
    <td><?= htmlspecialchars($fila['Nombre_alumno']) ?></td>
    <td><?= htmlspecialchars($fila['Cedula_alumno']) ?></td>

    <td>
        <input type="number" step="0.01" min="0" max="20"
               name="Nota_1"
               value="<?= $fila['Nota_1'] ?>"
               class="w3-input w3-border">
    </td>

    <td>
        <input type="number" step="0.01" min="0" max="20"
               name="Nota_2"
               value="<?= $fila['Nota_2'] ?>"
               class="w3-input w3-border">
    </td>

    <td>
        <input type="number" step="0.01" min="0" max="20"
               name="Nota_3"
               value="<?= $fila['Nota_3'] ?>"
               class="w3-input w3-border">
    </td>

    <td><?= $fila['Promedio_alumno'] ?></td>

    <td>
        <?php if ($fila['Estado_alumno'] === 'Aprobado'): ?>
            <span class="w3-text-green">Aprobado</span>
        <?php else: ?>
            <span class="w3-text-red">Desaprobado</span>
        <?php endif; ?>
    </td>

    <td>
        <button class="w3-button w3-green w3-small">
            Guardar
        </button>
    </td>

</form>
</tr>

<?php endwhile; ?>

</table>
