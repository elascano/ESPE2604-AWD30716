<?php

namespace Config;

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    private static bool $initialized = false;

    public static function initialize(): void
    {
        if (self::$initialized) {
            return;
        }

        $capsule = new Capsule();

        $capsule->addConnection([
            'driver'    => 'pgsql',
            'host'      => $_ENV['DB_HOST'],
            'port'      => (int) $_ENV['DB_PORT'],
            'database'  => $_ENV['DB_NAME'],
            'username'  => $_ENV['DB_USER'],
            'password'  => $_ENV['DB_PASS'],
            'charset'   => 'utf8',
            'schema'    => 'public',
            'options'   => [\PDO::ATTR_EMULATE_PREPARES => true],
        ]);

        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        self::$initialized = true;
    }
}
