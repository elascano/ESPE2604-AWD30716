<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Customer.php';

use App\model\Customer;

$id = $_GET['id'] ?? null;

if (!$id) {
    header('Location: viewCustomers.php');
    exit();
}

$customer = Customer::find($id);

if (!$customer) {
    header('Location: viewCustomers.php');
    exit();
}

include __DIR__ . '/../view/editCustomer.php';