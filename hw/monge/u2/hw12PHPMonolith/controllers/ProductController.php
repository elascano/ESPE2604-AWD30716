<?php
/**
 * controllers/ProductController.php
 * 
 * Product Controller class.
 * Adheres to Single Responsibility by managing HTTP request flow, 
 * orchestrating input validation, interacting with the model, and choosing 
 * which view layout to load.
 */

require_once __DIR__ . '/../models/Product.php';

class ProductController {
    
    /**
     * Default constructor. Start session if not already running.
     */
    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Renders the page listing all products.
     */
    public function list() {
        $error = null;
        $products = [];
        try {
            $products = Product::all();
        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        // View configuration
        $view = 'list';
        $title = 'Product Inventory Catalog';
        require_once __DIR__ . '/../views/layout.php';
    }

    /**
     * Renders the product registration or update form page.
     */
    public function register() {
        $error = null;
        $product = null;
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if ($id) {
            try {
                $product = Product::find($id);
                if (!$product) {
                    $_SESSION['flash_error'] = "Product with ID $id was not found.";
                    header('Location: index.php?action=list');
                    exit;
                }
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        // If not editing or search failed, instantiate a new empty product model
        if (!$product) {
            $product = new Product();
        }

        // View configuration
        $view = 'register';
        $title = $product->id ? 'Modify Product Details' : 'Register Technological Product';
        require_once __DIR__ . '/../views/layout.php';
    }

    /**
     * Receives form post submissions to insert or update product information.
     */
    public function save() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: index.php?action=list');
            exit;
        }

        $id = (isset($_POST['id']) && $_POST['id'] !== '') ? (int)$_POST['id'] : null;
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';
        $quantity = isset($_POST['quantity']) ? trim($_POST['quantity']) : '';
        $price = isset($_POST['price']) ? trim($_POST['price']) : '';

        // Form Validation
        $errors = [];
        if (empty($name)) {
            $errors[] = "The product name is required.";
        } elseif (strlen($name) > 150) {
            $errors[] = "The product name cannot exceed 150 characters.";
        }

        if ($quantity === '') {
            $errors[] = "The product quantity is required.";
        } else {
            $qtyVal = filter_var($quantity, FILTER_VALIDATE_INT);
            if ($qtyVal === false || $qtyVal < 0) {
                $errors[] = "Quantity must be a non-negative integer.";
            } else {
                $quantity = $qtyVal;
            }
        }

        if ($price === '') {
            $errors[] = "The product unit price is required.";
        } else {
            $priceVal = filter_var($price, FILTER_VALIDATE_FLOAT);
            if ($priceVal === false || $priceVal <= 0) {
                $errors[] = "Price must be a positive decimal number.";
            } else {
                $price = $priceVal;
            }
        }

        // If validations fail, redirect with error context
        if (!empty($errors)) {
            $_SESSION['flash_errors'] = $errors;
            $_SESSION['old_input'] = [
                'name' => $name,
                'quantity' => $_POST['quantity'],
                'price' => $_POST['price']
            ];
            $redirectUrl = $id ? "index.php?action=register&id=$id" : "index.php?action=register";
            header("Location: $redirectUrl");
            exit;
        }

        try {
            // Map inputs and initialize Product model (single responsibility for calculation)
            $productData = [
                'name' => $name,
                'quantity' => $quantity,
                'price' => $price
            ];
            if ($id) {
                $productData['id'] = $id;
            }

            $product = new Product($productData);
            
            if ($product->save()) {
                $_SESSION['flash_success'] = $id 
                    ? "Product '{$product->name}' updated successfully in the system!" 
                    : "Product '{$product->name}' registered successfully with 15% VAT!";
                header('Location: index.php?action=list');
                exit;
            } else {
                $_SESSION['flash_error'] = "An error occurred while saving the product. Please try again.";
                $redirectUrl = $id ? "index.php?action=register&id=$id" : "index.php?action=register";
                header("Location: $redirectUrl");
                exit;
            }
        } catch (Exception $e) {
            $_SESSION['flash_error'] = "Database Transaction Error: " . $e->getMessage();
            $redirectUrl = $id ? "index.php?action=register&id=$id" : "index.php?action=register";
            header("Location: $redirectUrl");
            exit;
        }
    }
}
