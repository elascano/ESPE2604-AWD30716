<?php
require_once __DIR__ . '/../database.php';

class StoreProduct {
    private $collection;

    public function __construct() {
        $db = new Database();
        $this->collection = $db->getCollection();
    }

    public function save($id, $name, $quantity) {
        $document = [
            'id' => $id,
            'name' => $name,
            'quantity' => (int)$quantity
        ];
        $this->collection->insertOne($document);
    }

    public function getAll() {
        return $this->collection->find()->toArray();
    }

    public function getTotalQuantity() {
        $products = $this->getAll();
        $total = 0;
        foreach ($products as $product) {
            $total += $product['quantity'];
        }
        return $total;
    }
}
?>