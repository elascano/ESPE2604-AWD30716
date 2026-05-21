<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Models\Product;
use PDO;

class ProductService
{
    private PDO $connection;

    public function __construct()
    {
        $this->connection = Database::getConnection();
    }

    /**
     * @return Product[]
     */
    public function getAllProducts(): array
    {
        $statement = $this->connection->query(
            'select id, name, price, quantity from products order by id asc'
        );

        $rows = $statement->fetchAll();

        return array_map(
            fn (array $row): Product => new Product($row),
            $rows
        );
    }

    public function createProduct(string $name, float $price, int $quantity): bool
    {
        $statement = $this->connection->prepare(
            'insert into products (name, price, quantity) values (:name, :price, :quantity)'
        );

        return $statement->execute([
            ':name' => trim($name),
            ':price' => $price,
            ':quantity' => $quantity,
        ]);
    }

    public function updateProduct(int $id, string $name, float $price, int $quantity): bool
    {
        $statement = $this->connection->prepare(
            'update products
             set name = :name,
                 price = :price,
                 quantity = :quantity
             where id = :id'
        );

        $statement->execute([
            ':id' => $id,
            ':name' => trim($name),
            ':price' => $price,
            ':quantity' => $quantity,
        ]);

        return $statement->rowCount() > 0;
    }

    public function deleteProduct(int $id): bool
    {
        $statement = $this->connection->prepare(
            'delete from products where id = :id'
        );

        $statement->execute([
            ':id' => $id,
        ]);

        return $statement->rowCount() > 0;
    }

    /**
     * @param Product[] $products
     */
    public function getTotalQuantity(array $products): int
    {
        return array_sum(array_map(
            fn (Product $product): int => $product->quantity,
            $products
        ));
    }

    /**
     * @param Product[] $products
     */
    public function getTotalInventoryValue(array $products): float
    {
        return array_sum(array_map(
            fn (Product $product): float => $product->totalValue,
            $products
        ));
    }
}
