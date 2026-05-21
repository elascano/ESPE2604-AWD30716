<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\ProductService;
use Throwable;

class ProductController
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function create(): void
    {
        $pageTitle = 'Add Product';
        $contentView = __DIR__ . '/../Views/products/create.php';

        require __DIR__ . '/../Views/layouts/main.php';
    }

    public function store(): void
    {
        $name = trim($_POST['name'] ?? '');
        $price = $this->parseFloat($_POST['price'] ?? '');
        $quantity = filter_var($_POST['quantity'] ?? null, FILTER_VALIDATE_INT);

        if ($name === '' || $price === null || $price <= 0 || $quantity === false || $quantity < 1) {
            $_SESSION['error'] = 'Please check the entered data before saving the product.';
            $_SESSION['old'] = [
                'name' => $name,
                'price' => $_POST['price'] ?? '',
                'quantity' => $_POST['quantity'] ?? '',
            ];

            $this->redirect('/products/create');
        }

        try {
            $this->productService->createProduct($name, $price, (int) $quantity);
            $_SESSION['success'] = 'Product saved successfully.';
            $this->redirect('/products/create');
        } catch (Throwable $exception) {
            $_SESSION['error'] = APP_DEBUG
                ? 'Create error: ' . $exception->getMessage()
                : 'The product could not be saved. Please try again.';

            $_SESSION['old'] = [
                'name' => $name,
                'price' => $_POST['price'] ?? '',
                'quantity' => $_POST['quantity'] ?? '',
            ];

            $this->redirect('/products/create');
        }
    }

    public function index(): void
    {
        try {
            $products = $this->productService->getAllProducts();
            $totalQuantity = $this->productService->getTotalQuantity($products);
            $totalInventoryValue = $this->productService->getTotalInventoryValue($products);
        } catch (Throwable $exception) {
            $products = [];
            $totalQuantity = 0;
            $totalInventoryValue = 0;
            $_SESSION['error'] = APP_DEBUG
                ? 'Load error: ' . $exception->getMessage()
                : 'The products could not be loaded. Please try again.';
        }

        $pageTitle = 'Product List';
        $contentView = __DIR__ . '/../Views/products/index.php';

        require __DIR__ . '/../Views/layouts/main.php';
    }

    public function updateFromModal(): void
    {
        $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
        $name = trim($_POST['name'] ?? '');
        $price = $this->parseFloat($_POST['price'] ?? '');
        $quantity = filter_var($_POST['quantity'] ?? null, FILTER_VALIDATE_INT);

        if ($id === false || $id < 1 || $name === '' || $price === null || $price <= 0 || $quantity === false || $quantity < 1) {
            $_SESSION['error'] = 'The product could not be updated because the entered data is invalid.';
            $this->redirect('/products');
        }

        try {
            $updated = $this->productService->updateProduct((int) $id, $name, $price, (int) $quantity);

            $_SESSION[$updated ? 'success' : 'error'] = $updated
                ? 'Product updated successfully.'
                : 'The selected product was not found.';
        } catch (Throwable $exception) {
            $_SESSION['error'] = APP_DEBUG
                ? 'Update error: ' . $exception->getMessage()
                : 'The product could not be updated. Please try again.';
        }

        $this->redirect('/products');
    }

    public function deleteFromModal(): void
    {
        $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

        if ($id === false || $id < 1) {
            $_SESSION['error'] = 'The selected product was not found.';
            $this->redirect('/products');
        }

        try {
            $deleted = $this->productService->deleteProduct((int) $id);

            $_SESSION[$deleted ? 'success' : 'error'] = $deleted
                ? 'Product deleted successfully.'
                : 'The selected product was not found.';
        } catch (Throwable $exception) {
            $_SESSION['error'] = APP_DEBUG
                ? 'Delete error: ' . $exception->getMessage()
                : 'The product could not be deleted. Please try again.';
        }

        $this->redirect('/products');
    }

    private function redirect(string $path): never
    {
        header('Location: ' . $path);
        exit;
    }

    private function parseFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        $normalizedValue = str_replace(',', '.', (string) $value);

        if (!is_numeric($normalizedValue)) {
            return null;
        }

        return (float) $normalizedValue;
    }
}
