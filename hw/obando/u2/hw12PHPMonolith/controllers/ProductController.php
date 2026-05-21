<?php
require_once __DIR__ . '/../models/ProductDAO.php';
require_once __DIR__ . '/../models/Product.php';

class ProductController {
    private $productDAO;

    public function __construct() {
        $this->productDAO = new ProductDAO();
    }

    public function handleRequest() {
        $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'index';

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->handlePost($action);
        } else {
            $this->handleGet($action);
        }
    }

    private function handlePost($action) {
        if ($action === 'save' || $action === 'update') {
            try {
                $id = isset($_POST['id']) ? trim($_POST['id']) : null;
                $name = isset($_POST['name']) ? trim($_POST['name']) : '';
                $quantityStr = isset($_POST['quantity']) ? trim($_POST['quantity']) : '';
                $priceStr = isset($_POST['price']) ? trim($_POST['price']) : '';
                $category = isset($_POST['category']) ? trim($_POST['category']) : '';
                $description = isset($_POST['description']) ? trim($_POST['description']) : '';
                $supplier = isset($_POST['supplier']) ? trim($_POST['supplier']) : '';

                // Server-side validations
                if (empty($name) || $quantityStr === '' || $priceStr === '' || empty($category)) {
                    throw new Exception("Required fields are missing");
                }

                $quantity = (int)$quantityStr;
                $price = (float)$priceStr;

                if ($quantity < 0 || $price < 0) {
                    throw new Exception("No se permiten números negativos en la cantidad o el precio.");
                }

                $product = new Product($name, $quantity, $price, $category, $description, $supplier);

                if ($action === 'save') {
                    $this->productDAO->insertProduct($product);
                    header("Location: index.php?action=list&success=saved");
                    exit;
                } else if ($action === 'update') {
                    if (empty($id)) {
                        throw new Exception("ID required for update.");
                    }
                    $updated = $this->productDAO->updateProduct($id, $product);
                    if ($updated) {
                        header("Location: index.php?action=list&success=updated");
                    } else {
                        throw new Exception("Update failed, product not found.");
                    }
                    exit;
                }
            } catch (Exception $e) {
                $_GET['error'] = "Error saving product: " . $e->getMessage();
                // We fallback to the form
                if ($action === 'update') {
                    header("Location: index.php?action=list&error=update_error");
                } else {
                    $this->renderForm();
                }
            }
        } else if ($action === 'delete') {
            $id = isset($_POST['id']) ? trim($_POST['id']) : null;
            if (!empty($id)) {
                $deleted = $this->productDAO->deleteProduct($id);
                if ($deleted) {
                    header("Location: index.php?action=list&success=deleted");
                } else {
                    header("Location: index.php?action=list&error=delete_failed");
                }
            } else {
                header("Location: index.php?action=list&error=invalid_id");
            }
            exit;
        }
    }

    private function handleGet($action) {
        if ($action === 'list') {
            $products = $this->productDAO->getAll();
            
            $totalWarehouseValue = 0.0;
            $totalQuantity = 0;
            
            foreach ($products as $p) {
                $totalWarehouseValue += $p->getTotal();
                $totalQuantity += $p->getQuantity();
            }
            
            $weightedAveragePrice = 0.0;
            if ($totalQuantity > 0) {
                $weightedAveragePrice = $totalWarehouseValue / $totalQuantity;
            }
            
            // Require view and pass data
            require_once __DIR__ . '/../views/results.php';

        } else if ($action === 'edit') {
            $id = isset($_GET['id']) ? trim($_GET['id']) : null;
            if (!empty($id)) {
                $product = $this->productDAO->getProductById($id);
                if ($product != null) {
                    $this->renderForm($product);
                } else {
                    header("Location: index.php?action=list&error=not_found");
                    exit;
                }
            } else {
                header("Location: index.php?action=list&error=invalid_id");
                exit;
            }
        } else {
            // Default to insert page
            $this->renderForm();
        }
    }

    private function renderForm($product = null) {
        require_once __DIR__ . '/../views/index.php';
    }
}
?>
