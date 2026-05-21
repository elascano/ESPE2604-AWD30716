<?php

require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

class Database {
    private $connection;
    private $database;
    
    public function __construct() {
        $mongoUri = $_ENV['MONGODB_URI'] ?? getenv('MONGODB_URI') ?: 'mongodb+srv://cvdiaz3_db_user:admin123@cluster0.vigvruj.mongodb.net/product_db?retryWrites=true&w=majority';
        
        $options = [
            'serverSelectionTimeoutMS' => 10000,
            'connectTimeoutMS' => 10000,
            'retryWrites' => true,
            'w' => 'majority'
        ];
        
        try {
            $this->connection = new Client($mongoUri, [], $options);
            $this->database = $this->connection->selectDatabase('product_db');
        } catch (Exception $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new Exception('Database connection failed');
        }
    }
    
    public function getCollection($collectionName) {
        return $this->database->selectCollection($collectionName);
    }
    
    public function getDatabase() {
        return $this->database;
    }
}
