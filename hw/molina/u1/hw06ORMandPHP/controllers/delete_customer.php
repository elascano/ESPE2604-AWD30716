<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    if (!$id || !is_numeric($id)) {
        header('Location: ../records.php');
        exit;
    }

    $customer = R::load('customer', (int) $id);

    if ($customer->id) {
        R::trash($customer);
    }

    header('Location: ../records.php?status=deleted');
    exit;
}

header('Location: ../records.php');
exit;