<?php

header("Content-Type: application/json");

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/user.php';

Database::init();

try {
    $users = User::orderBy('created_at', 'desc')->get();
    echo json_encode($users);

} catch (Exception $e) {
    echo json_encode([]);
}
