<?php
session_start();

/* ================= BLOQUEO POR INTENTOS ================= */
$_SESSION['intentos'] = $_SESSION['intentos'] ?? 0;
$_SESSION['bloqueado_hasta'] = $_SESSION['bloqueado_hasta'] ?? 0;

if (time() < $_SESSION['bloqueado_hasta']) {
    echo "<script>
        alert('Demasiados intentos. Intente más tarde.');
        window.location.href = '../index.php';
    </script>";
    exit;
}

/* ================= CONEXIÓN ================= */
include_once "conexion.php";

/* ================= VALIDACIÓN FORM ================= */
if (!isset($_POST['usuario'], $_POST['clave'])) {
    echo "<script>
        alert('Acceso inválido');
        window.location.href = '../index.php';
    </script>";
    exit;
}

$usuario = trim($_POST['usuario']);
$clave   = $_POST['clave'];

/* ==========================================================
   INTENTAR LOGIN COMO USUARIO ADMIN
========================================================== */
$sqlUsuario = "SELECT id_usuario, Usuario_user, Clave_user
               FROM usuarios
               WHERE Usuario_user = ?
               AND Estado_user = 'Activo'";

$stmt = $conn->prepare($sqlUsuario);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$resultUsuario = $stmt->get_result();

if ($resultUsuario->num_rows === 1) {

    $usuarioData = $resultUsuario->fetch_assoc();

    if (!password_verify($clave, $usuarioData['Clave_user'])) {
        $_SESSION['intentos']++;
        errorLogin();
    }

    /* ================= ROLES ================= */
    $sqlRoles = "
    SELECT r.id_rol, r.Nombre_rol
    FROM usuarios_rol ur
    INNER JOIN rol r ON ur.id_rol = r.id_rol
    WHERE ur.id_usuario = ?
    AND r.Estado_rol = 'Activo'
    ";

    $stmtRoles = $conn->prepare($sqlRoles);
    $stmtRoles->bind_param("i", $usuarioData['id_usuario']);
    $stmtRoles->execute();
    $resultRoles = $stmtRoles->get_result();

    if ($resultRoles->num_rows === 0) {
        echo "<script>
            alert('Su cuenta no tiene roles activos.');
            window.location.href = '../index.php';
        </script>";
        exit;
    }

    $roles = [];
    $roles_id = [];

    while ($rol = $resultRoles->fetch_assoc()) {
        $roles[] = $rol['Nombre_rol'];
        $roles_id[] = $rol['id_rol'];
    }

    /* ================= PERMISOS ================= */
    $permisos = [];

    $placeholders = implode(',', array_fill(0, count($roles_id), '?'));
    $types = str_repeat('i', count($roles_id));

    $sqlPermisos = "
    SELECT DISTINCT o.codigo_opcion
    FROM permisos p
    INNER JOIN opciones o ON p.id_opcion = o.id_opcion
    WHERE p.id_rol IN ($placeholders)
    ";

    $stmtPermisos = $conn->prepare($sqlPermisos);
    $stmtPermisos->bind_param($types, ...$roles_id);
    $stmtPermisos->execute();
    $resultPermisos = $stmtPermisos->get_result();

    while ($permiso = $resultPermisos->fetch_assoc()) {
        $permisos[] = $permiso['codigo_opcion'];
    }

    /* ================= SESIÓN ADMIN ================= */
    $_SESSION['id_usuario'] = $usuarioData['id_usuario'];
    $_SESSION['usuario']    = $usuarioData['Usuario_user'];
    $_SESSION['roles']      = $roles;
    $_SESSION['permisos']   = $permisos;
    $_SESSION['tipo']       = "admin";
    $_SESSION['ultima_actividad'] = time();

    $_SESSION['intentos'] = 0;
    $_SESSION['bloqueado_hasta'] = 0;

    header("Location: ../paginas/inicio.php");
    exit;
}

/* ==========================================================
   SI NO ES USUARIO → INTENTAR COMO ALUMNO
========================================================== */
$sqlAlumno = "SELECT id_alumno, Usuario_alumno, Clave_alumno, Estado_alumno_AI
              FROM alumno
              WHERE Usuario_alumno = ?";

$stmtAlumno = $conn->prepare($sqlAlumno);
$stmtAlumno->bind_param("s", $usuario);
$stmtAlumno->execute();
$resultAlumno = $stmtAlumno->get_result();

if ($resultAlumno->num_rows === 1) {

    $alumnoData = $resultAlumno->fetch_assoc();

    /* ===== VERIFICAR ACTIVO ===== */
    if ($alumnoData['Estado_alumno_AI'] !== 'Activo') {
        echo "<script>
            alert('Su cuenta está inactiva.');
            window.location.href = '../index.php';
        </script>";
        exit;
    }

    /* ===== PASSWORD ===== */
    if (!password_verify($clave, $alumnoData['Clave_alumno'])) {
        $_SESSION['intentos']++;
        errorLogin();
    }

    /* ================= SESIÓN ALUMNO ================= */
    $_SESSION['id_usuario'] = $alumnoData['id_alumno'];
    $_SESSION['usuario']    = $alumnoData['Usuario_alumno'];
    $_SESSION['roles']      = ['usuario_normal'];
    $_SESSION['permisos']   = ['usuario_normal'];
    $_SESSION['tipo']       = "alumno";
    $_SESSION['ultima_actividad'] = time();

    $_SESSION['intentos'] = 0;
    $_SESSION['bloqueado_hasta'] = 0;

    header("Location: ../paginas/inicio.php");
    exit;
}

/* ==========================================================
   SI NO EXISTE EN NINGUNA TABLA
========================================================== */
$_SESSION['intentos']++;
errorLogin();


/* ==========================================================
   FUNCIÓN ERROR LOGIN
========================================================== */
function errorLogin() {

    if ($_SESSION['intentos'] >= 2) {
        $_SESSION['bloqueado_hasta'] = time() + 30;
        $_SESSION['intentos'] = 0;

        echo "<script>
            alert('Demasiados intentos fallidos. Bloqueado 30 segundos.');
            window.location.href = '../index.php';
        </script>";
        exit;
    }

    echo "<script>
        alert('Usuario o contraseña incorrectos');
        window.location.href = '../index.php';
    </script>";
    exit;
}
