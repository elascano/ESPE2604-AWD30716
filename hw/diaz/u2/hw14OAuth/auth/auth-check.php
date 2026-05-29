<?php
require_once __DIR__ . '/session.php';

$basePath = $GLOBALS['APP_BASE_PATH'] ?? '';

if (!isset($_SESSION['user'])) {
    header('Location: ' . $basePath . '/index.php?unauthorized=true');
    exit();
}
