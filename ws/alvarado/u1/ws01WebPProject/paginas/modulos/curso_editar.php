<?php
session_start();

/* ================= SEGURIDAD ================= */
if (!isset($_SESSION['usuario']) || 
    !in_array('curso_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

if (!isset($_POST['id_curso'])) {
    die("Curso no especificado");
}

include_once "../server/conexion.php";

$id_curso = intval($_POST['id_curso']);

/* ================= CONSULTAR CURSO ================= */
$sql = "SELECT * FROM curso WHERE id_curso = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error en la consulta");
}

$stmt->bind_param("i", $id_curso);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Curso no encontrado");
}

$curso = $result->fetch_assoc();

$stmt->close();
$conn->close();
?>

<h3 class="w3-center">EDITAR CURSO</h3>

<form method="post" action="../server/curso_actualizar.php" class="w3-container w3-card w3-padding">

    <input type="hidden" name="id_curso" value="<?= $curso['id_curso'] ?>">

    <p>
        <label><strong>Nombre del Curso:</strong></label>
        <input class="w3-input w3-border"
               type="text"
               name="Nombre_curso"
               value="<?= htmlspecialchars($curso['Nombre_curso']) ?>"
               required>
    </p>

    <p>
        <label><strong>Descripción:</strong></label>
        <textarea class="w3-input w3-border"
                  name="Descripcion_curso"
                  rows="4"><?= htmlspecialchars($curso['Descripcion_curso']) ?></textarea>
    </p>

    <div class="w3-center w3-margin-top">
        <button type="submit" class="w3-button w3-blue">
            Actualizar
        </button>

        <a href="inicio.php?op=curso_listar" 
           class="w3-button w3-light-grey">
            Cancelar
        </a>
    </div>

</form>
