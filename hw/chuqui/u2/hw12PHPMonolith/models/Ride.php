<?php
require_once __DIR__ . '/../config/db.php';

class Ride {
    public static function getAll() {
        global $ridesCollection;
        return $ridesCollection->find()->toArray();
    }

    public static function create($origin, $destination, $price) {
        global $ridesCollection;
        $ridesCollection->insertOne([
            'Origin' => $origin,
            'Destination' => $destination,
            'Price' => (float)$price,
            'Date' => new MongoDB\BSON\UTCDateTime()
        ]);
    }

    public static function delete($id) {
        global $ridesCollection;
        $ridesCollection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
    }

    public static function find($id) {
        global $ridesCollection;
        return $ridesCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($id)]);
    }

    public static function update($id, $origin, $destination, $price) {
        global $ridesCollection;
        $ridesCollection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($id)],
            ['$set' => [
                'Origin' => $origin, 
                'Destination' => $destination, 
                'Price' => (float)$price
            ]]
        );
    }
}
?>