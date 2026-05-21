<?php
require_once __DIR__ . '/../models/StoreProduct.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $quantity = $_POST['quantity'] ?? 0;

    if (!empty($id) && !empty($name)) {
        $productModel = new StoreProduct();
        $productModel->save($id, $name, $quantity);
    }
    
    header("Location: ../views/php/product-list.php");
    exit();
} else {
    header("Location: ../index.html");
    exit();
}
?>