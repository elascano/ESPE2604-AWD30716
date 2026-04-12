<?php
session_start();
include_once "../server/conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('usuario_editar_alumno', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== ID ALUMNO ===== */
if (!isset($_POST['id_alumno'])) {
    header("Location: inicio.php?op=alumno_listar");
    exit;
}

$id_alumno = intval($_POST['id_alumno']);

/* ===== DATOS DEL ALUMNO ===== */
$sqlAlumno = "
SELECT 
    id_alumno,
    id_curso,
    Usuario_alumno,
    Nombre_alumno,
    Cedula_alumno,
    Fecha_nacimiento,
    Direccion_alumno,
    Correo_alumno,
    Telefono_alumno
FROM alumno
WHERE id_alumno = ?
";


$stmt = $conn->prepare($sqlAlumno);
$stmt->bind_param("i", $id_alumno);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Alumno no encontrado");
}

$alumno = $result->fetch_assoc();
$stmt->close();

/* ===== CALCULAR EDAD ===== */
$fecha_nacimiento = new DateTime($alumno['Fecha_nacimiento']);
$hoy = new DateTime();
$edad = $hoy->diff($fecha_nacimiento)->y;


/* ===== CURSOS ACTIVOS ===== */

$sqlCursos = "SELECT id_curso, Nombre_curso 
              FROM curso 
              WHERE Estado_curso = 'Activo'
              ORDER BY Nombre_curso";

$resultCursos = $conn->query($sqlCursos);


?>

<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Editar Alumno</title>
<link rel="stylesheet" href="../estilos/estilos.css">
</head>

<body>

<h2 align="center">EDITAR ALUMNO</h2>

<form method="post" onsubmit="return validarFormulario();" action="../server/alumno_actualizar.php">

<input type="hidden" name="id_alumno" value="<?= $alumno['id_alumno'] ?>">

<fieldset>
<legend>Datos del Alumno</legend>

<p>
<label>Nombre:</label>
<input type="text" name="Nombre_alumno" id="nombre"
       required
       onchange="validar_letras(this)"
       value="<?= $alumno['Nombre_alumno'] ?>">
</p>

<p>
<label>Fecha de nacimiento:</label>
<input type="date" name="Fecha_nacimiento" required
value="<?= $alumno['Fecha_nacimiento'] ?>">
</p>

<p>
<label>Edad:</label>
<input type="text" value="<?= $edad ?> años" readonly>
</p>

<p>
<label>Usuario:</label>
<input type="text" name="Usuario_alumno" required
value="<?= $alumno['Usuario_alumno'] ?>">
</p>

<p>
<label>Cédula:</label>
<input type="text" name="Cedula_alumno" id="cedula"
       maxlength="10" required
       onchange="validar_cedula()"
       value="<?= $alumno['Cedula_alumno'] ?>">
</p>

<p>
<label>Dirección:</label>
<input type="text" name="Direccion_alumno"
value="<?= $alumno['Direccion_alumno'] ?>">
</p>

<p>
<label>Correo:</label>
<input type="email" name="Correo_alumno" id="email"
       onchange="validar_email()"
       value="<?= $alumno['Correo_alumno'] ?>">
</p>

<p>
<label>Teléfono:</label>
<input type="text" name="Telefono_alumno"
value="<?= $alumno['Telefono_alumno'] ?>">
</p>

<p>
<label>Curso:</label>
<select name="id_curso" required>

<?php while ($curso = $resultCursos->fetch_assoc()): ?>

<option value="<?= $curso['id_curso'] ?>"
    <?= ($curso['id_curso'] == $alumno['id_curso']) ? 'selected' : '' ?>>
    <?= htmlspecialchars($curso['Nombre_curso']) ?>
</option>

<?php endwhile; ?>

</select>
</p>
	
<p>
<label>Nueva contraseña:</label>
<input type="password" name="Clave_alumno">
<small>Dejar vacío para mantener la actual</small>
</p>

</fieldset>

<p align="center">
<input type="submit" value="Actualizar">
<a href="inicio.php?op=alumno_listar">Cancelar</a>
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
    if (!validar_letras(document.getElementById("nombre"))) return false;
    if (!validar_cedula()) return false;
    if (!validar_email()) return false;

    return true;
}
</script>
	
	
</body>
</html>
