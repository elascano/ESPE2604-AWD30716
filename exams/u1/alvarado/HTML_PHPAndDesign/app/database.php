<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    private static $initialized = false;

    public static function init()
    {
        if (self::$initialized) return;

        $capsule = new Capsule;

        $capsule->addConnection([
            'driver'    => 'pgsql',
            'host'      => 'aws-1-us-east-1.pooler.supabase.com', 
            'port'      => '5432',
            'database'  => 'postgres',                             
            'username'  => 'postgres.aokspgkcmwopqapytejd',              
            'password'  => 'Alexander12.Dalmatax1011.',                          
            'charset'   => 'utf8',
            'prefix'    => '',
            'schema'    => 'public',
            'sslmode'   => 'require',
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        self::$initialized = true;
    }
}
