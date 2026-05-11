<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'   => 'pgsql',
    'url'      => 'postgresql://postgres.vogjqkdulbxdmdazgohi:5Pi5sxxDrOzUcEdO@aws-1-us-west-1.pooler.supabase.com:5432/postgres',
    'charset'  => 'utf8',
    'prefix'   => '',
    'sslmode'  => 'require',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
