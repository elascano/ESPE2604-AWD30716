<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap/app.php';

use App\Controllers\SongController;
use App\Core\Database;
use App\Core\Router;

$router = new Router();

$router->get('/', [SongController::class, 'index']);
$router->get('/songs/create', [SongController::class, 'create']);
$router->post('/songs', [SongController::class, 'store']);
$router->get('/songs/show', [SongController::class, 'show']);
$router->get('/songs/edit', [SongController::class, 'edit']);
$router->post('/songs/update', [SongController::class, 'update']);
$router->post('/songs/delete', [SongController::class, 'destroy']);

$router->get('/health', function (): void {
    Database::connection()->query('SELECT 1');
    header('Content-Type: application/json');
    echo json_encode(['status' => 'ok', 'database' => 'connected']);
});

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
