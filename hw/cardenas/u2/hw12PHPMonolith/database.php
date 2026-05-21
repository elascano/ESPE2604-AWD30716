<?php
require_once __DIR__ . '/vendor/autoload.php';

class Database {
    private $client;
    private $collection;

    public function __construct() {
        $uri = "mongodb+srv://admin:admin@cluster0.x7strgx.mongodb.net/?appName=Cluster0";
        $this->client = new MongoDB\Client($uri);
        $this->collection = $this->client->StoreDB->products;
    }

    public function getCollection() {
        return $this->collection;
    }
}
?>