<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . '/../vendor/autoload.php';

$capsule = new Capsule;

$capsule->addConnection([
    "driver" => "pgsql",
    "host" => "https://pjdbftkrbrguiulkhnpk.supabase.co/rest/v1/",
    "database" => "postgres",
    "username" => "pjdbftkrbrguiulkhnpk",
    "password" => "ddtvydtt432",
    "port" => "6543",
    "charset" => "utf8",
    "schema" => "public",
    "sslmode" => "require"
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
