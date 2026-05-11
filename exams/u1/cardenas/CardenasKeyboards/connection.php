<?php
require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => 'aws-1-us-west-1.pooler.supabase.com',
    'database'  => 'postgres',
    'username'  => 'postgres.zvgywflbkeayjyzheryg',
    'password'  => 'Exam1@ascardenas4',
    'port'      => '5432',
    'charset'   => 'utf8',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();