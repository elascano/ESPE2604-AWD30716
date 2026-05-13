<?php

require_once __DIR__ . '/../config/database.php';

use RedBeanPHP\R;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    if (!$id || !is_numeric($id)) {
        header('Location: ../records.php');
        exit;
    }

    $apartment = R::load('apartment', (int) $id);

    if ($apartment->id) {
        R::trash($apartment);
    }

    header('Location: ../records.php?status=deleted');
    exit;
}

header('Location: ../records.php');
exit;