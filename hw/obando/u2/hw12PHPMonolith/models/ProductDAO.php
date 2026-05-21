<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/Product.php';

class ProductDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
        $this->createTableIfNotExists();
    }

    private function createTableIfNotExists() {
        $sql = "
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            category VARCHAR(100),
            description TEXT,
            supplier VARCHAR(255)
        );
        ";
        $this->pdo->exec($sql);
    }

    public function insertProduct(Product $p) {
        $sql = "INSERT INTO products (name, quantity, price, category, description, supplier) 
                VALUES (:name, :quantity, :price, :category, :description, :supplier)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'name' => $p->getName(),
            'quantity' => $p->getQuantity(),
            'price' => $p->getPrice(),
            'category' => $p->getCategory(),
            'description' => $p->getDescription(),
            'supplier' => $p->getSupplier()
        ]);
    }

    public function getAll() {
        $sql = "SELECT * FROM products ORDER BY id DESC";
        $stmt = $this->pdo->query($sql);
        
        $products = [];
        while ($row = $stmt->fetch()) {
            $products[] = new Product(
                $row['name'],
                $row['quantity'],
                $row['price'],
                $row['category'],
                $row['description'],
                $row['supplier'],
                $row['id']
            );
        }
        return $products;
    }

    public function deleteProduct($id) {
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function getProductById($id) {
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        
        if ($row) {
            return new Product(
                $row['name'],
                $row['quantity'],
                $row['price'],
                $row['category'],
                $row['description'],
                $row['supplier'],
                $row['id']
            );
        }
        return null;
    }

    public function updateProduct($id, Product $p) {
        $sql = "UPDATE products SET 
                name = :name, 
                quantity = :quantity, 
                price = :price, 
                category = :category, 
                description = :description, 
                supplier = :supplier 
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'id' => $id,
            'name' => $p->getName(),
            'quantity' => $p->getQuantity(),
            'price' => $p->getPrice(),
            'category' => $p->getCategory(),
            'description' => $p->getDescription(),
            'supplier' => $p->getSupplier()
        ]);
        
        return $stmt->rowCount() > 0;
    }
}
?>
