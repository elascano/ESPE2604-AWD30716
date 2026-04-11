<?php
// Seguridad
if (!in_array('rol_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once '../server/conexion.php';

/* Obtener roles EXCEPTO Administrador */
$sqlRoles = "SELECT id_rol, Nombre_rol 
             FROM rol 
             WHERE Nombre_rol <> 'Administrador'";

$resultRoles = $conn->query($sqlRoles);
?>

<div class="w3-container w3-card w3-padding">

<h3 class="w3-text-blue">Ingreso de Rol</h3>

<form method="post" action="../server/insercion_rol.php">

<fieldset class="w3-margin-bottom">
<legend><strong>Datos del Rol</strong></legend>

<p>
<label>Nombre del Rol:</label>
<input type="text" name="Nombre_rol" class="w3-input" required>
</p>

<p>
<label>Descripción del Rol:</label>
<textarea name="Descripcion_rol" class="w3-input" rows="4" required></textarea>
</p>

</fieldset>

<!-- ================= PERMISOS ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Permisos</strong></legend>

<?php
$sqlOpciones = "SELECT id_opcion, nombre_opcion 
                FROM opciones 
                ORDER BY menu_opcion";

$resultOpciones = $conn->query($sqlOpciones);

while ($op = $resultOpciones->fetch_assoc()):
?>
<p>
<label>
<input type="checkbox" name="permisos[]" value="<?= $op['id_opcion'] ?>">
<?= $op['nombre_opcion'] ?>
</label>
</p>
<?php endwhile; ?>

</fieldset>

<button type="submit" class="w3-button w3-green">Guardar Rol</button>
<button type="reset" class="w3-button w3-gray">Limpiar</button>

</form>
</div>
