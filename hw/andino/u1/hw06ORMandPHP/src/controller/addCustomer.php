<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Customer.php';

use App\model\Customer;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        Customer::create([
            'names'      => $_POST['names'],
            'surnames'   => $_POST['surnames'],
            'birth_date' => $_POST['birth_date'],
            'age'        => (int)$_POST['age'],
            'email'      => $_POST['email'],
            'cellphone'  => $_POST['cellphone']
        ]);
        
        header("Location: ../view/saved.html"); 
        exit();

    } catch (\Exception $e) {
        die("Error when saving: " . $e->getMessage());
    }
}