<?php
require_once __DIR__ . '/models/ProductDAO.php';

try {
    $dao = new ProductDAO(); // Constructor creates the table and connects
    $products = $dao->getAll();
    echo "¡Conexión MVC exitosa mediante POOLER! La tabla 'products' está lista.\n";
    echo "Productos actuales: " . count($products) . "\n";
} catch (Exception $e) {
    echo "Error de conexión: " . $e->getMessage() . "\n";
}
?>
