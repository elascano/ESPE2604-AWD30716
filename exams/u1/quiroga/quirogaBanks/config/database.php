<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . '/../vendor/autoload.php';

$capsule = new Capsule;

$capsule->addConnection([
    "driver" => "pgsql",
    "host" => "db.pjdbftkrbrguiulkhnpk.supabase.co",
    "database" => "postgres",
    "username" => "postgres",
    "password" => "ddtvydtt432",
    "port" => "5432",
    "charset" => "utf8",
    "schema" => "public",
    "sslmode" => "require"
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
