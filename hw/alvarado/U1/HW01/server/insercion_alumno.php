<?php
session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('alumno_ingresar', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS DEL FORMULARIO ===== */
$Nombre_alumno   = trim($_POST['Nombre_alumno'] ?? '');
$Cedula_alumno   = trim($_POST['Cedula_alumno'] ?? '');
$Fecha_nacimiento= $_POST['Fecha_nacimiento'] ?? '';
$Edad_alumno     = $_POST['Edad_alumno'] ?? null;
$Direccion_alumno= trim($_POST['Direccion_alumno'] ?? '');
$Correo_alumno   = trim($_POST['Correo_alumno'] ?? '');
$Telefono_alumno = trim($_POST['Telefono_alumno'] ?? '');

$Usuario_alumno  = trim($_POST['Usuario_alumno'] ?? '');
$Clave_plana     = $_POST['Clave_alumno'] ?? '';

$id_curso        = !empty($_POST['id_curso']) ? $_POST['id_curso'] : NULL;

$Nota_1 = $_POST['Nota_1'] ?? null;
$Nota_2 = $_POST['Nota_2'] ?? null;
$Nota_3 = $_POST['Nota_3'] ?? null;

/* ===== VALIDACIONES BÁSICAS ===== */
if (
    $Nombre_alumno === '' ||
    $Cedula_alumno === '' ||
    $Fecha_nacimiento === '' ||
    $Edad_alumno === null ||
    $Usuario_alumno === '' ||
    $Clave_plana === '' ||
    $Nota_1 === null ||
    $Nota_2 === null ||
    $Nota_3 === null
) {
    die("Todos los campos obligatorios deben completarse");
}

/* ===== VALIDAR EDAD ===== */
if (!is_numeric($Edad_alumno) || $Edad_alumno > 18 || $Edad_alumno < 0) {
    die("Edad no válida. El alumno no puede tener más de 18 años.");
}

/* ===== VALIDAR NOTAS ===== */
$notas = [$Nota_1, $Nota_2, $Nota_3];

foreach ($notas as $nota) {
    if (!is_numeric($nota) || $nota < 0 || $nota > 20) {
        die("Las notas deben estar entre 0 y 20");
    }
}

/* ===== VALIDAR USUARIO ÚNICO ===== */
$sql_check_user = "SELECT id_alumno FROM alumno WHERE Usuario_alumno = ?";
$stmt_check = $conn->prepare($sql_check_user);
$stmt_check->bind_param("s", $Usuario_alumno);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    die("El usuario ya existe");
}
$stmt_check->close();

/* ===== VALIDAR CÉDULA ÚNICA ===== */
$sql_check_ced = "SELECT id_alumno FROM alumno WHERE Cedula_alumno = ?";
$stmt_check = $conn->prepare($sql_check_ced);
$stmt_check->bind_param("s", $Cedula_alumno);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    die("La cédula ya está registrada");
}
$stmt_check->close();

/* ===== CIFRAR CLAVE ===== */
$Clave_cifrada = password_hash($Clave_plana, PASSWORD_DEFAULT);

/* ===== CÁLCULOS ===== */
$Promedio_alumno = round(($Nota_1 + $Nota_2 + $Nota_3) / 3, 2);
$Estado_alumno   = ($Promedio_alumno >= 14) ? 'Aprobado' : 'Desaprobado';

/* ===== INSERTAR ALUMNO ===== */
$sql = "
INSERT INTO alumno
(Nombre_alumno, Cedula_alumno, Fecha_nacimiento, Edad_alumno,
 Direccion_alumno, Correo_alumno, Telefono_alumno,
 Usuario_alumno, Clave_alumno,
 id_curso,
 Nota_1, Nota_2, Nota_3, Promedio_alumno, Estado_alumno)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssisssssiddsss",
    $Nombre_alumno,
    $Cedula_alumno,
    $Fecha_nacimiento,
    $Edad_alumno,
    $Direccion_alumno,
    $Correo_alumno,
    $Telefono_alumno,
    $Usuario_alumno,
    $Clave_cifrada,
    $id_curso,
    $Nota_1,
    $Nota_2,
    $Nota_3,
    $Promedio_alumno,
    $Estado_alumno
);

if (!$stmt->execute()) {
    die("Error al registrar alumno: " . $stmt->error);
}

/* ===== AUDITORÍA ===== */
include_once "auditoria.php";
$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor registró al alumno $Nombre_alumno con promedio $Promedio_alumno ($Estado_alumno)"
);

/* ===== CIERRE ===== */
$stmt->close();
$conn->close();

echo "<script>
alert('Alumno registrado correctamente');
window.location.href = '../paginas/inicio.php';
</script>";
