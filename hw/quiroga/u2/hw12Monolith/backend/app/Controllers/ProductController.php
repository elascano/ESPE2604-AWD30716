<?php

namespace App\Controllers;

use App\Models\Product;
use App\Views\JsonView;

class ProductController
{
    public function index(): void
    {
        $products = Product::all();
        $grandTotal = Product::grandTotal();

        JsonView::render([
            'products' => $products,
            'grandTotal' => $grandTotal
        ]);
    }

    public function store(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($data['name'] ?? '');
        $description = trim($data['description'] ?? '');
        $quantity = (int) ($data['quantity'] ?? 0);
        $unitPrice = (float) ($data['unit_price'] ?? 0.0);

        $errors = $this->validate($name, $quantity, $unitPrice);

        if (!empty($errors)) {
            JsonView::render(['errors' => $errors], 400);
            return;
        }

        $product = Product::create([
            'name' => $name,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
        ]);

        JsonView::render(['success' => true, 'product' => $product], 201);
    }

    private function validate(string $name, int $quantity, float $unitPrice): array
    {
        $errors = [];

        if (empty($name)) {
            $errors[] = 'Name is required.';
        }
        if ($quantity <= 0) {
            $errors[] = 'Quantity must be greater than zero.';
        }
        if ($unitPrice <= 0) {
            $errors[] = 'Unit price must be greater than zero.';
        }

        return $errors;
    }
}
