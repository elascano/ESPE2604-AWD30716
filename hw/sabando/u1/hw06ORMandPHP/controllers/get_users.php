<?php
require_once '../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

try {
    $users = User::select('id', 'name', 'email', 'lastname', 'username', 'ruc')
                 ->orderBy('id', 'desc')
                 ->get();

    echo json_encode(['status' => 'success', 'data' => $users]);
} catch (\Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>