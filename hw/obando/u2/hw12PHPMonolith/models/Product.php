<?php
class Product {
    private $id;
    private $name;
    private $quantity;
    private $price;
    private $category;
    private $description;
    private $supplier;

    public function __construct($name = "", $quantity = 0, $price = 0.0, $category = "", $description = "", $supplier = "", $id = null) {
        $this->name = $name;
        $this->quantity = $quantity;
        $this->price = $price;
        $this->category = $category;
        $this->description = $description;
        $this->supplier = $supplier;
        $this->id = $id;
    }

    // Getters and Setters
    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getName() { return $this->name; }
    public function setName($name) { $this->name = $name; }

    public function getQuantity() { return $this->quantity; }
    public function setQuantity($quantity) { $this->quantity = $quantity; }

    public function getPrice() { return $this->price; }
    public function setPrice($price) { $this->price = $price; }

    public function getCategory() { return $this->category; }
    public function setCategory($category) { $this->category = $category; }

    public function getDescription() { return $this->description; }
    public function setDescription($description) { $this->description = $description; }

    public function getSupplier() { return $this->supplier; }
    public function setSupplier($supplier) { $this->supplier = $supplier; }

    public function getTotal() {
        return $this->quantity * $this->price;
    }
}
?>
