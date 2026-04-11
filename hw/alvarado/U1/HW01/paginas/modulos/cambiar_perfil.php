<?php
session_start();
include_once "../server/conexion.php";

if (!isset($_SESSION['usuario'], $_SESSION['tipo'])) {
    header("Location: ../index.php");
    exit;
}

$tipo = $_SESSION['tipo'];
$id   = $_SESSION['id_usuario'];

/* ==========================================================
   OBTENER DATOS ACTUALES
========================================================== */
if ($tipo === "admin") {

    $sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
}
else {

    $sql = "SELECT * FROM alumno WHERE id_alumno = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
}

$stmt->execute();
$result = $stmt->get_result();
$datos = $result->fetch_assoc();

/* ==========================================================
   OBTENER CURSOS (SOLO PARA ALUMNO)
========================================================== */
if ($tipo !== "admin") {
    $cursos = $conn->query("SELECT id_curso, Nombre_curso FROM curso ORDER BY Nombre_curso ASC");
}

/* ==========================================================
   ACTUALIZAR PERFIL
========================================================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($tipo === "admin") {

        $nuevoUsuario = trim($_POST['usuario']);

        $check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE Usuario_user = ? AND id_usuario != ?");
        $check->bind_param("si", $nuevoUsuario, $id);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            die("El nombre de usuario ya existe.");
        }

        if (!empty($_POST['clave_actual'])) {

            if (!password_verify($_POST['clave_actual'], $datos['Clave_user'])) {
                die("Contraseña actual incorrecta.");
            }

            $nuevaClave = password_hash($_POST['clave_nueva'], PASSWORD_DEFAULT);
        } else {
            $nuevaClave = $datos['Clave_user'];
        }

        $edad = calcularEdad($_POST['fecha']);

        $update = $conn->prepare("UPDATE usuarios 
            SET Nombres_user=?, Apellidos_user=?, Usuario_user=?, Cedula_user=?,
                Clave_user=?, Fecha_nacimiento=?, Edad_user=?
            WHERE id_usuario=?");

        $update->bind_param("ssssssii",
            $_POST['nombres'],
            $_POST['apellidos'],
            $nuevoUsuario,
            $_POST['cedula'],
            $nuevaClave,
            $_POST['fecha'],
            $edad,
            $id
        );
    }
    else {

        $nuevoUsuario = trim($_POST['usuario']);
        $id_curso = $_POST['id_curso']; // 👈 NUEVO

        $check = $conn->prepare("SELECT id_alumno FROM alumno WHERE Usuario_alumno = ? AND id_alumno != ?");
        $check->bind_param("si", $nuevoUsuario, $id);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            die("El nombre de usuario ya existe.");
        }

        if (!empty($_POST['clave_actual'])) {

            if (!password_verify($_POST['clave_actual'], $datos['Clave_alumno'])) {
                die("Contraseña actual incorrecta.");
            }

            $nuevaClave = password_hash($_POST['clave_nueva'], PASSWORD_DEFAULT);
        } else {
            $nuevaClave = $datos['Clave_alumno'];
        }

        $edad = calcularEdad($_POST['fecha']);

        $update = $conn->prepare("UPDATE alumno 
            SET Usuario_alumno=?, Clave_alumno=?, Nombre_alumno=?, Cedula_alumno=?,
                Fecha_nacimiento=?, Edad_alumno=?, Direccion_alumno=?, 
                Correo_alumno=?, Telefono_alumno=?, id_curso=?
            WHERE id_alumno=?");

        $update->bind_param("ssssssssiii",
            $nuevoUsuario,
            $nuevaClave,
            $_POST['nombre'],
            $_POST['cedula'],
            $_POST['fecha'],
            $edad,
            $_POST['direccion'],
            $_POST['correo'],
            $_POST['telefono'],
            $id_curso,
            $id
        );
    }

    if ($update->execute()) {
        $_SESSION['usuario'] = $nuevoUsuario;
        echo "<script>alert('Perfil actualizado correctamente'); window.location='inicio.php';</script>";
        exit;
    } else {
        echo "Error al actualizar.";
    }
}

/* ==========================================================
   FUNCIÓN CALCULAR EDAD
========================================================== */
function calcularEdad($fecha) {
    $hoy = new DateTime();
    $nacimiento = new DateTime($fecha);
    return $hoy->diff($nacimiento)->y;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Cambiar Perfil</title>
</head>
<body>

<h2>Cambiar Perfil</h2>

<form method="POST" onsubmit="return validarFormulario();">

<?php if ($tipo === "admin"): ?>

    Nombres:
    <input type="text" id="nombres" name="nombres"
        value="<?= $datos['Nombres_user'] ?>" required
        onchange="validar_letras(this)"><br>

    Apellidos:
    <input type="text" id="apellidos" name="apellidos"
        value="<?= $datos['Apellidos_user'] ?>" required
        onchange="validar_letras(this)"><br>

<?php else: ?>

    Nombre:
    <input type="text" id="nombre" name="nombre"
        value="<?= $datos['Nombre_alumno'] ?>" required
        onchange="validar_letras(this)"><br>

    Dirección:
    <input type="text" name="direccion"
        value="<?= $datos['Direccion_alumno'] ?>"><br>

    Correo:
    <input type="email" id="correo" name="correo"
        value="<?= $datos['Correo_alumno'] ?>"
        onchange="validar_email()"><br>

    Teléfono:
    <input type="text" name="telefono"
        value="<?= $datos['Telefono_alumno'] ?>"><br>

    Curso:
    <select name="id_curso" required>
        <option value="">Seleccione un curso</option>
        <?php while($curso = $cursos->fetch_assoc()): ?>
            <option value="<?= $curso['id_curso'] ?>"
                <?= ($curso['id_curso'] == $datos['id_curso']) ? 'selected' : '' ?>>
                <?= $curso['Nombre_curso'] ?>
            </option>
        <?php endwhile; ?>
    </select><br><br>

<?php endif; ?>

Usuario:
<input type="text" name="usuario"
    value="<?= $tipo === 'admin' ? $datos['Usuario_user'] : $datos['Usuario_alumno'] ?>"
    required><br>

Cédula:
<input type="text" id="cedula" name="cedula"
    value="<?= $tipo === 'admin' ? $datos['Cedula_user'] : $datos['Cedula_alumno'] ?>"
    required onchange="validar_cedula()"><br>

Fecha Nacimiento:
<input type="date" name="fecha"
    value="<?= $datos['Fecha_nacimiento'] ?>" required><br>

<hr>

<h3>Cambiar contraseña</h3>
Clave actual: <input type="password" name="clave_actual"><br>
Nueva clave: <input type="password" name="clave_nueva"><br>

<br>
<button type="submit">Guardar Cambios</button>

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
    let email = document.getElementById("correo");
    if (!email || email.value === "") return true;

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.value)) {
        alert("Correo electrónico inválido");
        email.focus();
        return false;
    }
    return true;
}

function validar_cedula() {
    let cedulaInput = document.getElementById("cedula");
    if (!cedulaInput) return true;

    let cedula = cedulaInput.value;

    if (cedula.length !== 10 || isNaN(cedula)) {
        alert("La cédula debe tener 10 dígitos numéricos");
        cedulaInput.focus();
        return false;
    }

    let provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
        alert("Código de provincia inválido");
        cedulaInput.focus();
        return false;
    }

    let suma = 0;
    for (let i = 0; i < 9; i++) {
        let num = parseInt(cedula.charAt(i));
        if (i % 2 === 0) {
            num *= 2;
            if (num > 9) num -= 9;
        }
        suma += num;
    }

    let digito = (10 - (suma % 10)) % 10;

    if (digito !== parseInt(cedula.charAt(9))) {
        alert("Cédula ecuatoriana inválida");
        cedulaInput.focus();
        return false;
    }

    return true;
}

function validarFormulario() {

    let nombres = document.getElementById("nombres");
    let apellidos = document.getElementById("apellidos");
    let nombre = document.getElementById("nombre");

    if (nombres && !validar_letras(nombres)) return false;
    if (apellidos && !validar_letras(apellidos)) return false;
    if (nombre && !validar_letras(nombre)) return false;

    if (!validar_cedula()) return false;
    if (!validar_email()) return false;

    return true;
}

</script>
	
</body>
</html>
