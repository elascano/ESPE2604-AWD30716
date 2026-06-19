<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefixes = [
        'App\\Controllers\\' => __DIR__ . '/Controllers/',
        'App\\Middleware\\' => __DIR__ . '/Middleware/',
        'App\\Services\\' => __DIR__ . '/Services/',
        'App\\Support\\' => __DIR__ . '/Support/',
        'App\\Models\\' => __DIR__ . '/Models/',
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
