<?php
require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$dbHost = 'aws-1-us-east-2.pooler.supabase.com';
$dbPort = 5432;                            
$dbName = 'postgres';       
$dbUser = 'postgres.hoskmelosabzuxjvbjyk';
$dbPass = 'fabuladental30716';

$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => $dbHost,
    'port'      => $dbPort,
    'database'  => $dbName,
    'username'  => $dbUser,
    'password'  => $dbPass,
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();

$capsule->bootEloquent();