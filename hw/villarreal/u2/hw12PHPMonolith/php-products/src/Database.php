<?php

declare(strict_types=1);

namespace App;

use MongoDB\Client;
use MongoDB\Collection;
use MongoDB\Database as MongoDatabase;

final class Database
{
    private static ?Database $instance = null;
    private MongoDatabase $database;

    private function __construct()
    {
        $connectionString = $_ENV['MONGO_CONNECTION_STRING'] ?? 'mongodb+srv://root123:root123@clusterglobal.wtz0nut.mongodb.net/?appName=ClusterGlobal';
        $databaseName = $_ENV['MONGO_DATABASE_NAME'] ?? 'ProductosMVC';

        $client = new Client($connectionString);
        $this->database = $client->selectDatabase($databaseName);
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function getCollection(string $collectionName): Collection
    {
        return $this->database->selectCollection($collectionName);
    }

    public function getProductsCollection(): Collection
    {
        return $this->getCollection('Product');
    }
}
