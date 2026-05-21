<?php

namespace App\Models;

require_once __DIR__ . '/../../config/Database.php';

use Database;
use MongoDB\BSON\ObjectId;

class Product {
    private $collection;
    
    public function __construct() {
        $database = new Database();
        $this->collection = $database->getCollection('phpRegister');
    }
    
    public function create($data) {
        try {
            $result = $this->collection->insertOne([
                'productName' => $data['productName'],
                'barcode' => $data['barcode'],
                'description' => $data['description'] ?? '',
                'category' => $data['category'],
                'manufacturer' => $data['manufacturer'],
                'weight' => (float)$data['weight'],
                'weightUnit' => $data['weightUnit'],
                'price' => (float)$data['price'],
                'quantity' => (int)$data['quantity'],
                'createdAt' => new \MongoDB\BSON\UTCDateTime(time() * 1000)
            ]);
            
            return ['success' => true, 'id' => $result->getInsertedId()];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getAll() {
        try {
            $products = $this->collection->find([], ['sort' => ['createdAt' => -1]]);
            return iterator_to_array($products);
        } catch (Exception $e) {
            return [];
        }
    }
    
    public function getById($id) {
        try {
            return $this->collection->findOne(['_id' => new ObjectId($id)]);
        } catch (Exception $e) {
            return null;
        }
    }
    
    public function delete($id) {
        try {
            $result = $this->collection->deleteOne(['_id' => new ObjectId($id)]);
            return $result->getDeletedCount() > 0;
        } catch (Exception $e) {
            return false;
        }
    }
}
