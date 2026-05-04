<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $name = trim($_POST['name'] ?? '');
    $age = trim($_POST['age'] ?? '');

    if (
        !$id ||
        !is_numeric($id) ||
        $name === '' ||
        $age === '' ||
        !is_numeric($age) ||
        (int) $age <= 0
    ) {
        header('Location: ../records.php');
        exit;
    }

    $customer = R::load('customer', (int) $id);

    if (!$customer->id) {
        header('Location: ../records.php');
        exit;
    }

    $customer->name = $name;
    $customer->age = (int) $age;

    R::store($customer);

    header('Location: ../records.php?status=updated');
    exit;
}

header('Location: ../records.php');
exit;