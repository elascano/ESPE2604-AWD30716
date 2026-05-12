<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $name = trim($_POST['name'] ?? '');
    $rooms = trim($_POST['number_of_rooms'] ?? '');
    $color = trim($_POST['color'] ?? '');

    if (
        !$id ||
        !is_numeric($id) ||
        $name === '' ||
        $rooms === '' ||
        !is_numeric($age) ||
        (int) $age <= 0 ||
        $color === ''
    ) {
        header('Location: ../records.php');
        exit;
    }

    $apartment = R::load('apartment', (int) $id);

    if (!$apartment->id) {
        header('Location: ../records.php');
        exit;
    }

    $apartment->name = $name;
    $apartment->rooms = (int) $rooms;
    $apartment->color = $color;

    R::store($apartment);

    header('Location: ../records.php?status=updated');
    exit;
}

header('Location: ../records.php');
exit;