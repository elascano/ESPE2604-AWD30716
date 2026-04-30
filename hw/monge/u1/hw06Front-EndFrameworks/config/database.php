<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . '/../vendor/autoload.php';

$capsule = new Capsule;

$capsule->addConnection([
    "driver" => "pgsql",
    "host" => "aws-1-us-west-2.pooler.supabase.com",
    "database" => "postgres",
    "username" => "postgres.jvnspjnntmkkjqdziodi",
    "password" => "Rmonge0867.",
    "port" => "6543",
    "charset" => "utf8",
    "schema" => "public",
    "sslmode" => "require"
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
