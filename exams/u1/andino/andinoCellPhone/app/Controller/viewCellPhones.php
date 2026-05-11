<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../Config/conection.php';
require_once __DIR__ . '/../Models/CellPhone.php';

use App\Models\CellPhone;

$cellphones = CellPhone::all();

include __DIR__ . '/../Vista/view.php';
