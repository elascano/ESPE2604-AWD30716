<?php
session_start();
include_once "conexion.php";

/* ===== SEGURIDAD ===== */
if (!in_array('usuario_editar_alumno', $_SESSION['permisos'])) {
    die("Acceso no autorizado");
}

/* ===== DATOS ===== */
$id_alumno         = intval($_POST['id_alumno']);
$Nombre_alumno     = trim($_POST['Nombre_alumno']);
$Usuario_alumno    = trim($_POST['Usuario_alumno']);
$Cedula_alumno     = trim($_POST['Cedula_alumno']);
$Fecha_nacimiento  = $_POST['Fecha_nacimiento'];
$Direccion_alumno  = trim($_POST['Direccion_alumno']);
$Correo_alumno     = trim($_POST['Correo_alumno']);
$Telefono_alumno   = trim($_POST['Telefono_alumno']);
$id_curso          = intval($_POST['id_curso']);
$Clave_alumno      = $_POST['Clave_alumno'];


/* ==========================================================
   VALIDAR USUARIO NO REPETIDO
========================================================== */
$checkUser = $conn->prepare(
    "SELECT id_alumno FROM alumno 
     WHERE Usuario_alumno = ? AND id_alumno != ?"
);
$checkUser->bind_param("si", $Usuario_alumno, $id_alumno);
$checkUser->execute();
$checkUser->store_result();

if ($checkUser->num_rows > 0) {
    die("El nombre de usuario ya está en uso");
}
$checkUser->close();


/* ==========================================================
   VALIDAR CÉDULA NO REPETIDA
========================================================== */
$checkCedula = $conn->prepare(
    "SELECT id_alumno FROM alumno 
     WHERE Cedula_alumno = ? AND id_alumno != ?"
);
$checkCedula->bind_param("si", $Cedula_alumno, $id_alumno);
$checkCedula->execute();
$checkCedula->store_result();

if ($checkCedula->num_rows > 0) {
    die("La cédula ya está registrada");
}
$checkCedula->close();


/* ===== CALCULAR EDAD ===== */
$fechaNac = new DateTime($Fecha_nacimiento);
$hoy = new DateTime();
$edad = $hoy->diff($fechaNac)->y;

/* ===== VALIDAR FECHA Y EDAD ===== */
if ($Fecha_nacimiento > date('Y-m-d') || $edad < 3 || $edad > 18) {
    die("Edad no válida. El alumno no puede tener más de 18 años.");
}


/* ===== VALIDAR CURSO ===== */
$sqlCurso = "SELECT id_curso FROM curso 
             WHERE id_curso = ? 
             AND Estado_curso = 'Activo'";

$stmtCurso = $conn->prepare($sqlCurso);
$stmtCurso->bind_param("i", $id_curso);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();

if ($resCurso->num_rows === 0) {
    die("Curso no válido o inactivo");
}
$stmtCurso->close();


/* ==========================================================
   ACTUALIZAR ALUMNO
========================================================== */
if (!empty($Clave_alumno)) {

    $clave_hash = password_hash($Clave_alumno, PASSWORD_DEFAULT);

    $sql = "UPDATE alumno SET
                id_curso=?,
                Nombre_alumno=?,
                Usuario_alumno=?,
                Cedula_alumno=?,
                Fecha_nacimiento=?,
                Edad_alumno=?,
                Direccion_alumno=?,
                Correo_alumno=?,
                Telefono_alumno=?,
                Clave_alumno=?
            WHERE id_alumno=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssissssi",
        $id_curso,
        $Nombre_alumno,
        $Usuario_alumno,
        $Cedula_alumno,
        $Fecha_nacimiento,
        $edad,
        $Direccion_alumno,
        $Correo_alumno,
        $Telefono_alumno,
        $clave_hash,
        $id_alumno
    );

} else {

    $sql = "UPDATE alumno SET
                id_curso=?,
                Nombre_alumno=?,
                Usuario_alumno=?,
                Cedula_alumno=?,
                Fecha_nacimiento=?,
                Edad_alumno=?,
                Direccion_alumno=?,
                Correo_alumno=?,
                Telefono_alumno=?
            WHERE id_alumno=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssisssi",
        $id_curso,
        $Nombre_alumno,
        $Usuario_alumno,
        $Cedula_alumno,
        $Fecha_nacimiento,
        $edad,
        $Direccion_alumno,
        $Correo_alumno,
        $Telefono_alumno,
        $id_alumno
    );
}

$stmt->execute();
$stmt->close();


/* ===== AUDITORÍA ===== */
include_once 'auditoria.php';

$actor = $_SESSION['usuario'];

registrarAuditoria(
    $conn,
    "$actor editó el alumno: $Usuario_alumno"
);

/* ===== FIN ===== */
$conn->close();

header("Location: ../paginas/inicio.php?op=alumno_listar");
exit;
