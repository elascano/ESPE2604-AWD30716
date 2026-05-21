<?php
require_once 'config.php';
require_once 'controllers/EmployeeController.php';

$controller = new EmployeeController();
$action = $_GET['action'] ?? 'index';

if ($action === 'create') {
    $controller->create();
} elseif ($action === 'delete') {
    $controller->delete(); 
} else {
    $controller->index();
}