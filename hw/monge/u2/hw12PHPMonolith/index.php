<?php
/**
 * index.php
 * 
 * Front Controller & Routing Gateway.
 * Intercepts all incoming client requests, resolves target route queries, 
 * and routes control to the appropriate controller and action methods.
 */

require_once __DIR__ . '/controllers/ProductController.php';

// Route action parsing. Default is 'list' (catalog view)
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

$controller = new ProductController();

switch ($action) {
    case 'list':
        $controller->list();
        break;
    case 'register':
        $controller->register();
        break;
    case 'save':
        $controller->save();
        break;
    default:
        // Redirect undefined actions back to index list page
        header('Location: index.php?action=list');
        exit;
}
