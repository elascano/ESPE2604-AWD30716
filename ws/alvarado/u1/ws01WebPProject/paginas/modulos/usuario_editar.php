<?php
session_start();
include_once "../server/conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('usuario_editar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== ID USUARIO ===== */
if (!isset($_POST['id_usuario'])) {
    header("Location: inicio.php?op=usuario_listar");
    exit;
}

$id_usuario = intval($_POST['id_usuario']);

/* ===== NO EDITARSE A SÍ MISMO ===== */
if ($id_usuario === $_SESSION['id_usuario']) {
    die("No puede editar su propio usuario");
}

/* ===== DATOS USUARIO ===== */
$sqlUsuario = "
SELECT 
    id_usuario,
    Nombres_user,
    Apellidos_user,
    Usuario_user,
    Cedula_user,
    Fecha_nacimiento
FROM usuarios
WHERE id_usuario = ?
";
$stmt = $conn->prepare($sqlUsuario);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Usuario no encontrado");
}

$usuario = $result->fetch_assoc();
$stmt->close();

/* ===== ROLES ACTUALES DEL USUARIO ===== */
$sqlUserRoles = "
SELECT r.id_rol, r.Nombre_rol
FROM usuarios_rol ur
INNER JOIN rol r ON ur.id_rol = r.id_rol
WHERE ur.id_usuario = ?
";
$stmtRolesUser = $conn->prepare($sqlUserRoles);
$stmtRolesUser->bind_param("i", $id_usuario);
$stmtRolesUser->execute();
$resultRolesUser = $stmtRolesUser->get_result();

$roles_usuario = [];
$es_admin = false;

while ($r = $resultRolesUser->fetch_assoc()) {
    $roles_usuario[] = $r['id_rol'];
    if ($r['Nombre_rol'] === 'Administrador') {
        $es_admin = true;
    }
}
$stmtRolesUser->close();

/* ===== BLOQUEAR EDICIÓN DE ADMIN ===== */
if ($es_admin) {
    die("No se puede editar el usuario Administrador");
}

/* ===== ROLES DISPONIBLES (ACTIVOS Y NO ADMIN) ===== */
$sqlRoles = "
SELECT id_rol, Nombre_rol
FROM rol
WHERE Estado_rol = 'Activo'
AND Nombre_rol <> 'Administrador'
";
$resultRoles = $conn->query($sqlRoles);
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Editar Usuario</title>
<link rel="stylesheet" href="../estilos/estilos.css">
</head>

<body>

<h2 align="center">EDITAR USUARIO</h2>

<form method="post"  onsubmit="return validarFormulario();" action="../server/usuario_actualizar.php">

<input type="hidden" name="id_usuario" value="<?= $usuario['id_usuario'] ?>">

<fieldset>
<legend>Datos del Usuario</legend>

<p>
<label>Nombres:</label>
<input type="text" name="Nombres_user" id="nombres"
       required
       onChange="validar_letras(this)"
       value="<?= $usuario['Nombres_user'] ?>">
</p>


<p>
<label>Apellidos:</label>
<input type="text" name="Apellidos_user" id="apellidos"
       required
       onChange="validar_letras(this)"
       value="<?= $usuario['Apellidos_user'] ?>">
</p>


<p>
<label>Fecha de nacimiento:</label>
<input type="date" name="Fecha_nacimiento" required
value="<?= $usuario['Fecha_nacimiento'] ?>">
</p>

<p>
<label>Usuario:</label>
<input type="text" name="Usuario_user" required
value="<?= $usuario['Usuario_user'] ?>">
</p>

<p>
<label>Cédula:</label>
<input type="text" name="Cedula_user" id="cedula"
       maxlength="10" required
       onChange="validar_cedula()"
       value="<?= $usuario['Cedula_user'] ?>">
</p>


<p>
<label>Nueva contraseña:</label>
<input type="password" name="Clave_user">
<small>Dejar vacío para mantener la actual</small>
</p>
</fieldset>

<fieldset class="w3-margin-bottom">
<legend><strong>Roles del Usuario</strong></legend>

<?php while ($rol = $resultRoles->fetch_assoc()): ?>
<p>
<label>
<input type="checkbox" name="roles[]"
       value="<?= $rol['id_rol'] ?>"
       <?= in_array($rol['id_rol'], $roles_usuario) ? 'checked' : '' ?>>
<?= $rol['Nombre_rol'] ?>
</label>
</p>
<?php endwhile; ?>

<p class="w3-text-grey w3-small">
* Los permisos se asignan automáticamente según los roles seleccionados.
</p>
</fieldset>

<p align="center">
<input type="submit" value="Actualizar">
<a href="inicio.php?op=usuario_editar_buscar">Cancelar</a>
</p>

</form>

<script>
function validar_letras(campo) {
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!regex.test(campo.value)) {
        alert("Solo se permiten letras");
        campo.value = "";
        campo.focus();
        return false;
    }
    return true;
}

function validar_cedula() {
    let cedula = document.getElementById("cedula").value;

    if (cedula.length !== 10 || isNaN(cedula)) {
        alert("La cédula debe tener 10 dígitos numéricos");
        document.getElementById("cedula").focus();
        return false;
    }

    let provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
        alert("Código de provincia inválido");
        document.getElementById("cedula").focus();
        return false;
    }

    let digitoVerificador = parseInt(cedula.charAt(9));
    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let num = parseInt(cedula.charAt(i));

        if (i % 2 === 0) {
            num *= 2;
            if (num > 9) num -= 9;
        }
        suma += num;
    }

    let resultado = (10 - (suma % 10)) % 10;

    if (resultado !== digitoVerificador) {
        alert("Cédula ecuatoriana inválida");
        document.getElementById("cedula").focus();
        return false;
    }

    return true;
}

function validarFormulario() {
    if (!validar_letras(document.getElementById("nombres"))) return false;
    if (!validar_letras(document.getElementById("apellidos"))) return false;
    if (!validar_cedula()) return false;

    return true;
}
</script>
	
	
</body>
</html>
	