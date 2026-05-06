<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $age = trim($_POST['age'] ?? '');

    if ($name === '' || $age === '' || !is_numeric($age) || (int) $age <= 0) {
        header('Location: ../index.php?status=error');
        exit;
    }

    $customer = R::dispense('customer');
    $customer->name = $name;
    $customer->age = (int) $age;

    R::store($customer);

    header('Location: ../index.php?status=success');
    exit;
}

header('Location: ../index.php');
exit;