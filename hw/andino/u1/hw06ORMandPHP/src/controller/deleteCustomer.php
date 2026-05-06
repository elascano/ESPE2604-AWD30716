<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Customer.php';

use App\model\Customer;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $customer = Customer::find($_POST['id'] ?? null);

        if ($customer) {
            $customer->delete();
        }

        header('Location: ../controller/viewCustomers.php');
        exit();
    } catch (\Throwable $e) {
        die('Error deleting: ' . $e->getMessage());
    }
}