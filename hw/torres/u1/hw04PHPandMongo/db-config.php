<?php
declare(strict_types=1);

require_once __DIR__ . '/app-config.php';

use MongoDB\Driver\Command;
use MongoDB\Driver\Exception\Exception as MongoDriverException;
use MongoDB\Driver\Manager;

final class MongoDBConnection
{
    private static ?self $instance = null;

    private Manager $manager;
    private string $databaseName;
    private string $collectionName;
    private string $namespace;

    private function __construct()
    {
        AppConfig::load();

        $this->databaseName = AppConfig::env('MONGODB_DATABASE', 'students') ?? 'students';
        $this->collectionName = AppConfig::env('MONGODB_COLLECTION', 'Customer') ?? 'Customer';
        $this->namespace = $this->databaseName . '.' . $this->collectionName;

        $uri = AppConfig::env('MONGODB_URI', 'mongodb://127.0.0.1:27017') ?? 'mongodb://127.0.0.1:27017';
        $driverOptions = [
            'appname' => AppConfig::env('MONGODB_APP_NAME', 'Customer CRUD') ?? 'Customer CRUD',
        ];

        try {
            $this->manager = new Manager($uri, [], $driverOptions);
            $this->manager->executeCommand('admin', new Command(['ping' => 1]));
            $this->ensureIndexes();
        } catch (MongoDriverException $exception) {
            throw new RuntimeException(
                'The application could not connect to MongoDB. Check the configured URI and make sure the service is reachable.',
                0,
                $exception
            );
        }
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function getManager(): Manager
    {
        return $this->manager;
    }

    public function getDatabaseName(): string
    {
        return $this->databaseName;
    }

    public function getCollectionName(): string
    {
        return $this->collectionName;
    }

    public function getNamespace(): string
    {
        return $this->namespace;
    }

    public function ping(): bool
    {
        try {
            $cursor = $this->manager->executeCommand('admin', new Command(['ping' => 1]));

            foreach ($cursor as $result) {
                return isset($result->ok) && (float) $result->ok === 1.0;
            }
        } catch (MongoDriverException) {
            return false;
        }

        return false;
    }

    private function ensureIndexes(): void
    {
        $command = new Command([
            'createIndexes' => $this->collectionName,
            'indexes' => [
                [
                    'key' => ['email' => 1],
                    'name' => 'unique_email',
                    'unique' => true,
                ],
                [
                    'key' => ['name' => 1],
                    'name' => 'name_1',
                ],
                [
                    'key' => ['career' => 1],
                    'name' => 'career_1',
                ],
                [
                    'key' => ['favorite_language' => 1],
                    'name' => 'favorite_language_1',
                ],
            ],
        ]);

        try {
            $this->manager->executeCommand($this->databaseName, $command);
        } catch (MongoDriverException) {
            // If the collection already contains legacy duplicate data, the app keeps working
            // and application-level validation still prevents new duplicate emails.
        }
    }
}
