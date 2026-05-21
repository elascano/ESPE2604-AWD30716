<?php
// Front Controller
// Este archivo recibe TODAS las peticiones y se las pasa al Controlador

require_once __DIR__ . '/controllers/ProductController.php';

$controller = new ProductController();
$controller->handleRequest();
?>
