<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $rooms = trim($_POST['number_of_rooms'] ?? '');
    $color = trim($_POST['color'] ?? '');

    if ($name === '' || $rooms === '' || !is_numeric($rooms) || (int) $rooms <= 0) {
        header('Location: ../index.php?status=error');
        exit;
    }

    $apartment = R::dispense('apartment');
    $apartment->name = $name;
    $apartment->rooms = (int) $rooms;
    $apartment->color = $color;

    R::store($apartment);

    header('Location: ../index.php?status=success');
    exit;
}

header('Location: ../index.php');
exit;