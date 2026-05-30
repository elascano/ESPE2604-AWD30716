<?php
/**
 * models/Product.php
 * 
 * Product Model class representing the 'products' table.
 * Adheres to the Single Responsibility Principle by handling ONLY data schema 
 * mapping, VAT calculation rules, and database CRUD query executions.
 */

require_once __DIR__ . '/../config/database.php';

class Product {
    public $id;
    public $name;
    public $quantity;
    public $price;
    public $subtotal;
    public $iva;
    public $total;
    public $created_at;

    /**
     * Product constructor.
     * 
     * @param array $data Assortment of values to pre-populate product parameters.
     */
    public function __construct($data = []) {
        $this->id = isset($data['id']) ? (int)$data['id'] : null;
        $this->name = isset($data['name']) ? trim($data['name']) : '';
        $this->quantity = isset($data['quantity']) ? (int)$data['quantity'] : 0;
        $this->price = isset($data['price']) ? (float)$data['price'] : 0.0;
        $this->created_at = isset($data['created_at']) ? $data['created_at'] : null;

        // Perform calculation for subtotal, 15% IVA and total
        $this->calculateTotals();
    }

    /**
     * Performs standard Ecuadorian VAT (15%) and sum calculations.
     */
    public function calculateTotals() {
        $this->subtotal = round($this->price * $this->quantity, 2);
        $this->iva = round($this->subtotal * 0.15, 2); // 15% VAT rate
        $this->total = round($this->subtotal + $this->iva, 2);
    }

    /**
     * Fetches all products from database sorted by ID descending.
     * 
     * @return Product[]
     */
    public static function all() {
        try {
            $db = Database::getConnection();
            $stmt = $db->query("SELECT * FROM public.products ORDER BY id DESC");
            $results = $stmt->fetchAll();
            
            $products = [];
            foreach ($results as $row) {
                $products[] = new self($row);
            }
            return $products;
        } catch (Exception $e) {
            // Rethrow or log error
            throw new Exception("Error fetching products: " . $e->getMessage());
        }
    }

    /**
     * Fetches a specific product by ID.
     * 
     * @param int $id The product identifier.
     * @return Product|null
     */
    public static function find($id) {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT * FROM public.products WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            
            if ($row) {
                return new self($row);
            }
            return null;
        } catch (Exception $e) {
            throw new Exception("Error finding product with ID $id: " . $e->getMessage());
        }
    }

    /**
     * Persists the current product to the database (performs INSERT or UPDATE).
     * 
     * @return bool
     */
    public function save() {
        try {
            $db = Database::getConnection();
            $this->calculateTotals();

            if ($this->id === null) {
                // Insert operation
                $sql = "INSERT INTO public.products (name, quantity, price, subtotal, iva, total) 
                        VALUES (:name, :quantity, :price, :subtotal, :iva, :total)";
                $stmt = $db->prepare($sql);
                $result = $stmt->execute([
                    'name' => $this->name,
                    'quantity' => $this->quantity,
                    'price' => $this->price,
                    'subtotal' => $this->subtotal,
                    'iva' => $this->iva,
                    'total' => $this->total
                ]);
                
                if ($result) {
                    $this->id = (int)$db->lastInsertId();
                }
                return $result;
            } else {
                // Update operation
                $sql = "UPDATE public.products 
                        SET name = :name, quantity = :quantity, price = :price, 
                            subtotal = :subtotal, iva = :iva, total = :total 
                        WHERE id = :id";
                $stmt = $db->prepare($sql);
                return $stmt->execute([
                    'id' => $this->id,
                    'name' => $this->name,
                    'quantity' => $this->quantity,
                    'price' => $this->price,
                    'subtotal' => $this->subtotal,
                    'iva' => $this->iva,
                    'total' => $this->total
                ]);
            }
        } catch (Exception $e) {
            throw new Exception("Error saving product: " . $e->getMessage());
        }
    }
}
