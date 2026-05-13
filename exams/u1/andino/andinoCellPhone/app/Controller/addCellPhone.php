<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../Config/conection.php';
require_once __DIR__ . '/../Models/CellPhone.php';

use App\Models\CellPhone;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        CellPhone::create([
            'brand'   => $_POST['brand'],
            'model'   => $_POST['model'],
            'price'   => $_POST['price'],
            'screen'  => $_POST['screen'],
            'ram'     => $_POST['ram'],
            'storage' => $_POST['storage'],
            'camera'  => $_POST['camera'],
            'battery' => $_POST['battery']
        ]);
        
        header("Location: ../Vista/saved.html"); 
        exit();

    } catch (\Exception $e) {
        die("Error when saving: " . $e->getMessage());
    }
}