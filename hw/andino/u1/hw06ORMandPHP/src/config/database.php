<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => 'aws-1-us-east-1.pooler.supabase.com',
    'database'  => 'postgres',
    'username'  => 'postgres.mibitvmvognqfzzhobqg',
    'password'  => '1ieFFRE1CdC02Vby', 
    'port'      => '5432',
    'charset'   => 'utf8',
    'prefix'    => '',
    'schema'    => 'public',
    'sslmode'   => 'require',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();