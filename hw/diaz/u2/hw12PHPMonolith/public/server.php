<?php
$port = getenv('PORT') ?: 8000;
$dir = __DIR__;

if (php_sapi_name() === 'cli-server') {
    if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|woff|woff2|ttf|svg)$/', $_SERVER["REQUEST_URI"])) {
        return false;
    }
}

require_once __DIR__ . '/index.php';
