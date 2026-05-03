<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../model/Customer.php';

use App\model\Customer;

$customers = Customer::all();

include __DIR__ . '/../view/viewCustomer.php';