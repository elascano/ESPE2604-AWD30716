<?php

declare(strict_types=1);

use App\Controllers\EmployeeController;
use App\Core\Database;

require_once dirname(__DIR__) . '/app/bootstrap.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && $path === '/health') {
    echo 'OK';
    exit;
}

if ($method === 'GET' && $path === '/favicon.ico') {
    http_response_code(204);
    exit;
}

if ($method === 'GET' && $path === '/') {
    header('Location: /employees');
    exit;
}

try {
    Database::loadEnv(APP_ROOT . '/.env');

    $controller = new EmployeeController();

    if ($method === 'GET' && $path === '/employees') {
        $controller->index();
        exit;
    }

    if ($method === 'GET' && $path === '/employees/create') {
        $controller->create();
        exit;
    }

    if ($method === 'POST' && $path === '/employees') {
        $controller->store($_POST);
        exit;
    }

    http_response_code(404);
    echo 'Page not found.';
} catch (Throwable $error) {
    http_response_code(500);
    error_log(sprintf(
        '[app-error] %s in %s:%d',
        $error->getMessage(),
        $error->getFile(),
        $error->getLine()
    ));

    $debug = ($_ENV['APP_DEBUG'] ?? 'false') === 'true';
    echo $debug ? nl2br(htmlspecialchars($error->getMessage(), ENT_QUOTES, 'UTF-8')) : 'Internal server error.';
}
