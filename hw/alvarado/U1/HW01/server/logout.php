<?php
session_start();

/* ===== ELIMINAR SESIÓN ===== */
$_SESSION = [];
session_unset();
session_destroy();

/* ===== ELIMINAR COOKIE DE SESIÓN ===== */
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

/* ===== EVITAR CACHE ===== */
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

/* ===== REDIRIGIR ===== */
header("Location: ../index.php");
exit;
