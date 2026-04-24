<?php
require '../vendor/autoload.php';

try {
    $client = new MongoDB\Client("mongodb+srv://root:root@cluster0.1isvndw.mongodb.net/?appName=Cluster0");

    $collection = $client->students->Customer;

    $data = json_decode(file_get_contents("php://input"), true);

    $collection->insertOne([
        'name' => $data['name'],
        'email' => $data['email'],
        'birthday' => $data['birthday']
    ]);

    echo "Connect succesfully";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>