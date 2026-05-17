<?php

use App\Core\Security;

$config = require dirname(__DIR__, 2) . '/config/config.php';
$appName = $config['app']['name'];
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= Security::e($appName) ?></title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <div class="app-shell">
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon">♪</div>
                <div>
                    <strong>SongCloud</strong>
                    <span>MVC + ORM</span>
                </div>
            </div>
            <nav class="nav">
                <a href="/" class="nav-link">Panel principal</a>
                <a href="/songs/create" class="nav-link primary">Nueva canción</a>
            </nav>
            <div class="sidebar-note">
                <strong>Ejercicio:</strong>
                <span>CRUD dinámico de canciones con base de datos cloud.</span>
            </div>
        </aside>

        <main class="main">
            <?= $content ?>
        </main>
    </div>
    <script src="/assets/app.js"></script>
</body>
</html>
