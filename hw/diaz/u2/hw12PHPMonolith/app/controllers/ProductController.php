<?php

namespace App\Controllers;

require_once __DIR__ . '/../../app/models/Product.php';

use App\Models\Product;

class ProductController {
    private $product;
    
    public function __construct() {
        $this->product = new Product();
    }
    
    public function index() {
        $products = $this->product->getAll();
        require_once __DIR__ . '/../views/index.php';
    }
    
    public function store() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            return;
        }
        
        $data = [
            'productName' => $_POST['productName'] ?? '',
            'barcode' => $_POST['barcode'] ?? '',
            'description' => $_POST['description'] ?? '',
            'category' => $_POST['category'] ?? '',
            'manufacturer' => $_POST['manufacturer'] ?? '',
            'weight' => $_POST['weight'] ?? 0,
            'weightUnit' => $_POST['weightUnit'] ?? '',
            'price' => $_POST['price'] ?? 0,
            'quantity' => $_POST['quantity'] ?? 0
        ];
        
        if (!$this->validate($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Validation failed']);
            return;
        }
        
        $result = $this->product->create($data);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    }
    
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }
        
        $id = $_POST['id'] ?? '';
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID is required']);
            return;
        }
        
        $success = $this->product->delete($id);
        
        header('Content-Type: application/json');
        echo json_encode(['success' => $success]);
    }
    
    private function validate($data) {
        $required = ['productName', 'barcode', 'category', 'manufacturer', 'weight', 'weightUnit', 'price', 'quantity'];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return false;
            }
        }
        
        if (!is_numeric($data['weight']) || !is_numeric($data['price']) || !is_numeric($data['quantity'])) {
            return false;
        }
        
        return true;
    }
}
