<?php

declare(strict_types=1);

namespace App;

final class ProductController
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(): void
    {
        $products = $this->productService->getAll();
        $this->render('product/index', [
            'title' => 'Product List',
            'products' => $products,
        ]);
    }

    public function createForm(): void
    {
        $this->render('product/create', [
            'title' => 'Register Product',
            'product' => new Product(),
            'errors' => [],
        ]);
    }

    public function create(): void
    {
        $data = $_POST;
        $validator = new Validator();

        if (!$validator->validateProduct($data)) {
            $this->render('product/create', [
                'title' => 'Register Product',
                'product' => new Product(
                    name: $data['name'] ?? '',
                    category: $data['category'] ?? '',
                    basePrice: (float) ($data['basePrice'] ?? 0),
                    quantity: (int) ($data['quantity'] ?? 0),
                    description: $data['description'] ?? ''
                ),
                'errors' => $validator->getErrors(),
            ]);
            return;
        }

        $product = new Product(
            name: trim($data['name']),
            category: trim($data['category']),
            basePrice: (float) $data['basePrice'],
            quantity: (int) $data['quantity'],
            description: trim($data['description'] ?? '')
        );

        $this->productService->create($product);
        $this->redirect('/');
    }

    public function details(string $id): void
    {
        $product = $this->productService->getById($id);

        if ($product === null) {
            $this->notFound();
            return;
        }

        $this->render('product/details', [
            'title' => 'Product Details',
            'product' => $product,
        ]);
    }

    public function editForm(string $id): void
    {
        $product = $this->productService->getById($id);

        if ($product === null) {
            $this->notFound();
            return;
        }

        $this->render('product/edit', [
            'title' => 'Edit Product',
            'product' => $product,
            'errors' => [],
        ]);
    }

    public function edit(string $id): void
    {
        $existing = $this->productService->getById($id);

        if ($existing === null) {
            $this->notFound();
            return;
        }

        $data = $_POST;
        $validator = new Validator();

        if (!$validator->validateProduct($data)) {
            $this->render('product/edit', [
                'title' => 'Edit Product',
                'product' => new Product(
                    id: $id,
                    name: $data['name'] ?? '',
                    category: $data['category'] ?? '',
                    basePrice: (float) ($data['basePrice'] ?? 0),
                    quantity: (int) ($data['quantity'] ?? 0),
                    description: $data['description'] ?? '',
                    registrationDate: $existing->getRegistrationDate()
                ),
                'errors' => $validator->getErrors(),
            ]);
            return;
        }

        $product = new Product(
            id: $id,
            name: trim($data['name']),
            category: trim($data['category']),
            basePrice: (float) $data['basePrice'],
            quantity: (int) $data['quantity'],
            description: trim($data['description'] ?? ''),
            registrationDate: $existing->getRegistrationDate()
        );

        $this->productService->update($product);
        $this->redirect('/');
    }

    public function deleteForm(string $id): void
    {
        $product = $this->productService->getById($id);

        if ($product === null) {
            $this->notFound();
            return;
        }

        $this->render('product/delete', [
            'title' => 'Delete Product',
            'product' => $product,
        ]);
    }

    public function delete(string $id): void
    {
        $this->productService->delete($id);
        $this->redirect('/');
    }

    public function error(string $message = ''): void
    {
        http_response_code(500);
        $this->render('error', [
            'title' => 'Error',
            'error' => $message,
        ]);
    }

    public function notFound(): void
    {
        http_response_code(404);
        $this->render('error', [
            'title' => 'Not Found',
            'error' => '',
        ]);
    }

    private function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    private function render(string $view, array $data): void
    {
        extract($data);
        require __DIR__ . '/../views/layout/header.php';
        require __DIR__ . '/../views/' . $view . '.php';
        require __DIR__ . '/../views/layout/footer.php';
    }
}
