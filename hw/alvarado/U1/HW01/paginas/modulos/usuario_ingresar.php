<?php
session_start();

// ===== SEGURIDAD =====
if (!in_array('usuario_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once '../server/conexion.php';

/* ===== ROLES (EXCEPTO ADMIN) ===== */
$sqlRoles = "SELECT id_rol, Nombre_rol 
             FROM rol 
             WHERE Nombre_rol <> 'Administrador'";
$resultRoles = $conn->query($sqlRoles);
?>

<div class="w3-container w3-card w3-padding">

<h3 class="w3-text-blue">Ingreso de Usuario</h3>

<?php if (isset($_GET['error'])): ?>

    <?php if ($_GET['error'] == 'cedula_duplicada'): ?>
        <div class="w3-panel w3-red w3-round">
            La cédula ya está registrada en el sistema.
        </div>
    <?php endif; ?>

    <?php if ($_GET['error'] == 'general'): ?>
        <div class="w3-panel w3-red w3-round">
            Ocurrió un error al crear el usuario.
        </div>
    <?php endif; ?>

<?php endif; ?>

<form method="post" 
      action="../server/insercion_usuario.php"
      onsubmit="return validarFormulario();">

<!-- ================= DATOS DEL USUARIO ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Datos del Usuario</strong></legend>

<p>
<label>Nombres:</label>
<input type="text" name="Nombres_user" 
       class="w3-input"
       onblur="validar_letras(this)"
       required>
</p>

<p>
<label>Apellidos:</label>
<input type="text" name="Apellidos_user" 
       class="w3-input"
       onblur="validar_letras(this)"
       required>
</p>

<p>
<label>Cédula:</label>
<input type="text" name="Cedula_user"
       id="cedula"
       class="w3-input"
       maxlength="10" onChange="validar_cedula()"
       required>
</p>

<p>
<label>Fecha de nacimiento:</label>
<input type="date" 
       name="Fecha_nacimiento" 
       id="fecha_nacimiento"
       class="w3-input"
       required
       onchange="calcularEdad()">
</p>

<p>
<label>Edad:</label>
<input type="text" id="edad" class="w3-input" disabled>
</p>

<p>
<label>Usuario:</label>
<input type="text" name="Usuario_user" class="w3-input" required>
</p>

<p>
<label>Contraseña:</label>
<input type="password" name="Clave_user" class="w3-input" required>
</p>

<p>
<label>Estado:</label>
<select name="Estado_user" class="w3-select" required>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
</select>
</p>

</fieldset>

<!-- ================= ROLES ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Roles del Usuario</strong></legend>

<?php while ($rol = $resultRoles->fetch_assoc()): ?>
<p>
<label>
<input type="checkbox" name="roles[]" value="<?= $rol['id_rol'] ?>">
<?= $rol['Nombre_rol'] ?>
</label>
</p>
<?php endwhile; ?>

<p class="w3-text-grey w3-small">
* Los permisos se asignan automáticamente según los roles seleccionados.
</p>

</fieldset>

<button type="submit" class="w3-button w3-green">Guardar Usuario</button>
<button type="reset" class="w3-button w3-gray">Limpiar</button>

</form>
</div>

<!-- ================= VALIDACIONES ================= -->
<script>

// ===== VALIDAR SOLO LETRAS =====
function validar_letras(campo) {
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!regex.test(campo.value)) {
        alert("Solo se permiten letras");
        campo.value = " ";
        campo.focus();
        return false;
    }
    return true;
}


// ===== VALIDAR CÉDULA ECUATORIANA =====
function validar_cedula() {

    let cedula = document.getElementById("cedula").value;

    if (cedula.length !== 10 || isNaN(cedula)) {
        alert("La cédula debe tener 10 dígitos numéricos");
        return false;
    }

    let provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
        alert("Código de provincia inválido");
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
        return false;
    }

    return true;
}


// ===== CALCULAR EDAD =====
function calcularEdad() {

    const fechaInput = document.getElementById('fecha_nacimiento');
    const edadInput  = document.getElementById('edad');

    if (!fechaInput.value) {
        edadInput.value = '';
        return true;
    }

    const fechaNac = new Date(fechaInput.value);
    const hoy = new Date();

    if (fechaNac > hoy) {
        alert("La fecha no puede ser futura");
        fechaInput.value = '';
        edadInput.value = '';
        return false;
    }

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    if (edad < 0 || edad > 100) {
        alert("Edad no válida");
        fechaInput.value = '';
        edadInput.value = '';
        return false;
    }

    edadInput.value = edad + " años";
    return true;
}


// ===== VALIDAR TODO EL FORM =====
function validarFormulario() {

    if (!validar_cedula()) {
        return false;
    }

    if (!calcularEdad()) {
        return false;
    }

    return true;
}

</script>
