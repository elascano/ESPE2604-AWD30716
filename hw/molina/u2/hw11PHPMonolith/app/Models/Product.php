<?php

declare(strict_types=1);

namespace App\Models;

class Product
{
    public int $id;
    public string $name;
    public float $price;
    public int $quantity;
    public float $totalValue;

    public function __construct(array $data)
    {
        $this->id = (int) ($data['id'] ?? 0);
        $this->name = (string) ($data['name'] ?? '');
        $this->price = (float) ($data['price'] ?? 0);
        $this->quantity = (int) ($data['quantity'] ?? 0);
        $this->totalValue = $this->price * $this->quantity;
    }
}
