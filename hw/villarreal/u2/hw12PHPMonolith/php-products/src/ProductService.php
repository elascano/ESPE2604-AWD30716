<?php

declare(strict_types=1);

namespace App;

use MongoDB\BSON\ObjectId;

final class ProductService
{
    public function __construct(
        private readonly Database $database
    ) {
    }

    public function getAll(): array
    {
        $collection = $this->database->getProductsCollection();
        $documents = $collection->find(
            [],
            ['sort' => ['RegistrationDate' => -1]]
        );

        $products = [];

        foreach ($documents as $document) {
            $products[] = Product::fromBson($document);
        }

        return $products;
    }

    public function getById(string $id): ?Product
    {
        $collection = $this->database->getProductsCollection();

        $document = $collection->findOne(['_id' => $id]);

        if ($document === null && self::isObjectId($id)) {
            $document = $collection->findOne(['_id' => new ObjectId($id)]);
        }

        if ($document === null) {
            return null;
        }

        return Product::fromBson($document);
    }

    public function create(Product $product): string
    {
        $collection = $this->database->getProductsCollection();
        $result = $collection->insertOne($product->toBson());

        return (string) $result->getInsertedId();
    }

    public function update(Product $product): void
    {
        $id = $product->getId();

        $collection = $this->database->getProductsCollection();
        $data = $product->toBson();
        unset($data['RegistrationDate']);

        $result = $collection->updateOne(
            ['_id' => $id],
            ['$set' => $data]
        );

        if ($result->getMatchedCount() === 0 && self::isObjectId($id)) {
            $result = $collection->updateOne(
                ['_id' => new ObjectId($id)],
                ['$set' => $data]
            );
        }

        if ($result->getMatchedCount() === 0) {
            throw new \RuntimeException("Product with ID {$id} was not found");
        }
    }

    public function delete(string $id): void
    {
        $collection = $this->database->getProductsCollection();

        $result = $collection->deleteOne(['_id' => $id]);

        if ($result->getDeletedCount() === 0 && self::isObjectId($id)) {
            $result = $collection->deleteOne(['_id' => new ObjectId($id)]);
        }

        if ($result->getDeletedCount() === 0) {
            throw new \RuntimeException("Product with ID {$id} was not found");
        }
    }

    private static function isObjectId(string $value): bool
    {
        return preg_match('/^[a-fA-F0-9]{24}$/', $value) === 1;
    }
}
