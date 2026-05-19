<?php

namespace App\Controllers;

use App\Models\Product;

class ProductController
{
    public function index(): void
    {
        $products   = Product::all();
        $grandTotal = Product::grandTotal();
        require __DIR__ . '/../Views/list.php';
    }

    public function create(): void
    {
        $errors = [];
        require __DIR__ . '/../Views/create.php';
    }

    public function store(): void
    {
        $name        = trim($_POST['name']        ?? '');
        $description = trim($_POST['description'] ?? '');
        $quantity    = (int)   ($_POST['quantity']   ?? 0);
        $unitPrice   = (float) ($_POST['unit_price'] ?? 0.0);

        $errors = $this->validate($name, $quantity, $unitPrice);

        if (!empty($errors)) {
            require __DIR__ . '/../Views/create.php';
            return;
        }

        Product::create([
            'name'        => $name,
            'description' => $description,
            'quantity'    => $quantity,
            'unit_price'  => $unitPrice,
        ]);

        header('Location: /');
        exit;
    }

    private function validate(string $name, int $quantity, float $unitPrice): array
    {
        $errors = [];

        if (empty($name))    $errors[] = 'Name is required.';
        if ($quantity <= 0)  $errors[] = 'Quantity must be greater than zero.';
        if ($unitPrice <= 0) $errors[] = 'Unit price must be greater than zero.';

        return $errors;
    }
}
