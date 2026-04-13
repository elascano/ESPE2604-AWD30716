<?php
// ===== SEGURIDAD =====
if (!in_array('alumno_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

include_once "../server/conexion.php";

// Obtener cursos
$sql_cursos = "SELECT id_curso, Nombre_curso FROM curso ORDER BY Nombre_curso ASC";
$result_cursos = $conn->query($sql_cursos);
?>

<div class="w3-container w3-card w3-padding">

<h3 class="w3-text-blue">Ingreso de Alumno</h3>

<form method="post" action="../server/insercion_alumno.php" onsubmit="return validarFormulario();">

<!-- ================= DATOS PERSONALES ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Datos Personales</strong></legend>

<p>
<label>Nombre del alumno:</label>
<input type="text" name="Nombre_alumno" id="nombre"
       class="w3-input" required
       onchange="validar_letras(this)">
</p>

<p>
<label>Cédula:</label>
<input type="text" name="Cedula_alumno" id="cedula"
       class="w3-input" required
       maxlength="10"
       onchange="validar_cedula()">
</p>

<p>
<label>Fecha de Nacimiento:</label>
<input type="date" name="Fecha_nacimiento" id="fecha_nacimiento"
       class="w3-input" required onchange="calcularEdad()">
</p>

<p>
<label>Edad:</label>
<input type="number" name="Edad_alumno" id="edad_alumno"
       class="w3-input" readonly required>
</p>

<p>
<label>Dirección:</label>
<input type="text" name="Direccion_alumno" class="w3-input">
</p>

<p>
<label>Correo:</label>
<input type="email" name="Correo_alumno" id="email"
       class="w3-input"
       onchange="validar_email()">
</p>

<p>
<label>Teléfono:</label>
<input type="text" name="Telefono_alumno" class="w3-input">
</p>

</fieldset>

<!-- ================= DATOS DE ACCESO ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Datos de Acceso</strong></legend>

<p>
<label>Usuario:</label>
<input type="text" name="Usuario_alumno" class="w3-input" required>
</p>

<p>
<label>Clave:</label>
<input type="password" name="Clave_alumno" class="w3-input" required>
</p>

</fieldset>

<!-- ================= CURSO ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Curso (Opcional)</strong></legend>

<p>
<label>Curso:</label>
<select name="id_curso" class="w3-select">
    <option value="">Sin curso</option>
    <?php while($curso = $result_cursos->fetch_assoc()): ?>
        <option value="<?= $curso['id_curso'] ?>">
            <?= htmlspecialchars($curso['Nombre_curso']) ?>
        </option>
    <?php endwhile; ?>
</select>
</p>

</fieldset>

<!-- ================= NOTAS ================= -->
<fieldset class="w3-margin-bottom">
<legend><strong>Notas (obligatorias)</strong></legend>

<p>
<label>Nota 1:</label>
<input type="number" name="Nota_1" class="w3-input"
       min="0" max="20" step="0.01" required>
</p>

<p>
<label>Nota 2:</label>
<input type="number" name="Nota_2" class="w3-input"
       min="0" max="20" step="0.01" required>
</p>

<p>
<label>Nota 3:</label>
<input type="number" name="Nota_3" class="w3-input"
       min="0" max="20" step="0.01" required>
</p>

</fieldset>

<button type="submit" class="w3-button w3-green">Guardar Alumno</button>
<button type="reset" class="w3-button w3-gray">Limpiar</button>

</form>
</div>

<!-- ================= SCRIPT EDAD ================= -->
<script>
function calcularEdad() {
    const fechaInput = document.getElementById("fecha_nacimiento").value;
    const edadInput = document.getElementById("edad_alumno");

    if (!fechaInput) {
        edadInput.value = "";
        return;
    }

    const hoy = new Date();
    const nacimiento = new Date(fechaInput);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    if (edad > 18) {
        alert("El alumno no puede tener más de 18 años.");
        document.getElementById("fecha_nacimiento").value = "";
        edadInput.value = "";
        return;
    }

    edadInput.value = edad;
}
</script>

<script>
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

function validar_email() {
    let email = document.getElementById("email").value;
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== "" && !regex.test(email)) {
        alert("Correo electrónico inválido");
        document.getElementById("email").focus();
        return false;
    }
    return true;
}

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
        document.getElementById("cedula").focus();
        return false;
    }

    return true;
}

function validarFormulario() {
    if (!validar_letras(document.getElementById("nombre"))) return false;
    if (!validar_cedula()) return false;
    if (!validar_email()) return false;

    return true;
}
</script>
