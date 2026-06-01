<?php
declare(strict_types=1);

/**
 * Runtime autoload bridge for the top-level MVC folders.
 *
 * Composer will use the PSR-4 map in composer.json after dependencies are
 * installed. This bridge keeps the local installed vendor/autoload.php working
 * immediately after reorganizing the project folders.
 */
spl_autoload_register(static function (string $class): void {
    $prefixes = [
        'App\\Controller\\' => __DIR__ . '/Controller/',
        'App\\Middleware\\' => __DIR__ . '/Middleware/',
        'App\\Service\\' => __DIR__ . '/Service/',
        'App\\Support\\' => __DIR__ . '/Support/',
        'App\\Model\\' => dirname(__DIR__, 2) . '/Model/',
    ];

    foreach ($prefixes as $prefix => $basePath) {
        if (!str_starts_with($class, $prefix)) {
            continue;
        }

        $relativeClass = substr($class, strlen($prefix));
        $file = $basePath . str_replace('\\', '/', $relativeClass) . '.php';

        if (is_file($file)) {
            require $file;
        }
    }
});
