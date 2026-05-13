<?php

namespace App;

use MongoDB\Client;
use MongoDB\BSON\ObjectId;

class BuildingRepository
{
    private $collection;

    public function __construct()
    {
        $uri = getenv('MONGODB_URI');
        $client = new Client($uri);
        $this->collection = $client->gualotunaDB->buildings;
    }

    public function insert(array $data): array
    {
        $doc = [
            'name'       => $data['name'],
            'address'    => $data['address'],
            'floors'     => (int)$data['floors'],
            'area_sqm'   => (float)$data['area_sqm'],
            'type'       => $data['type'],
            'year_built' => (int)$data['year_built'],
            'owner'      => $data['owner'],
            'status'     => $data['status'],
            'value_usd'  => (float)$data['value_usd'],
            'material'   => $data['material'],
        ];
        $result = $this->collection->insertOne($doc);
        return ['inserted_id' => (string)$result->getInsertedId()];
    }

    public function findById(string $id): ?array
    {
        $doc = $this->collection->findOne(['_id' => new ObjectId($id)]);
        return $doc ? $this->toArray($doc) : null;
    }

    public function findAll(): array
    {
        $cursor = $this->collection->find([], ['sort' => ['name' => 1]]);
        $results = [];
        foreach ($cursor as $doc) {
            $results[] = $this->toArray($doc);
        }
        return $results;
    }

    private function toArray($doc): array
    {
        return [
            '_id'        => (string)$doc['_id'],
            'name'       => $doc['name'],
            'address'    => $doc['address'],
            'floors'     => $doc['floors'],
            'area_sqm'   => $doc['area_sqm'],
            'type'       => $doc['type'],
            'year_built' => $doc['year_built'],
            'owner'      => $doc['owner'],
            'status'     => $doc['status'],
            'value_usd'  => $doc['value_usd'],
            'material'   => $doc['material'],
        ];
    }
}
