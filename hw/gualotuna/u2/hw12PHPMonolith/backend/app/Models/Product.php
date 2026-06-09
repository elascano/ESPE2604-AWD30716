<?php

namespace App\Models;

class Product extends BaseModel
{
    protected static string $table    = 'products';
    protected static array  $fillable = ['name', 'description', 'quantity', 'unit_price', 'total_price'];

    public static function create(array $data): static
    {
        $data['total_price'] = round($data['quantity'] * $data['unit_price'], 2);
        return parent::create($data);
    }

    public static function grandTotal(): float
    {
        return self::sum('total_price');
    }
}
