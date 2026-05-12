<?php

declare(strict_types=1);

namespace Config;

use Doctrine\ODM\MongoDB\Configuration;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Mapping\Driver\AttributeDriver;
use MongoDB\Client;

class Database
{
    private static ?DocumentManager $documentManager = null;

    private function __construct()
    {
    }

    public static function getDocumentManager(): DocumentManager
    {
        if (self::$documentManager === null) {
            $uri = $_ENV['MONGODB_URI'] ?? 'mongodb://localhost:27017';
            $dbName = $_ENV['MONGODB_DB'] ?? 'students_db';

            $client = new Client($uri);

            $config = new Configuration();
            $config->setProxyDir(sys_get_temp_dir() . '/Proxies');
            $config->setProxyNamespace('Proxies');
            $config->setHydratorDir(sys_get_temp_dir() . '/Hydrators');
            $config->setHydratorNamespace('Hydrators');
            $config->setDefaultDB($dbName);
            $config->setMetadataDriverImpl(AttributeDriver::create(__DIR__ . '/../models'));

            self::$documentManager = DocumentManager::create($client, $config);
        }

        return self::$documentManager;
    }
}
