<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('UTC');

define('APP_PATH', dirname(__DIR__) . '/app');
define('CONFIG_PATH', dirname(__DIR__) . '/config');
define('PUBLIC_PATH', __DIR__);

if (file_exists(dirname(__DIR__) . '/.env')) {
    $envFile = file_get_contents(dirname(__DIR__) . '/.env');
    $lines = explode("\n", $envFile);
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (!empty($line) && strpos($line, '=') !== false && strpos($line, '#') === 0) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            if (!getenv($key)) {
                putenv($key . '=' . $value);
            }
        }
    }
}
